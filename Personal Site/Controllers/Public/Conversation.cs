using Juniper;
using Juniper.Azure;
using Juniper.HTTP;
using Juniper.Sound;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;

using System.Text;

namespace SeanMcBeth.Controllers.Public
{
    [ApiController, Route("ai/conversation")]
    public class Conversation : ControllerBase
    {
        private readonly ISpeechService speech;
        private readonly IOpenAIService openAI;
        private readonly UserManager<IdentityUser>? users;
        private readonly ILogger logger;

        public Conversation(ISpeechService speech, IOpenAIService openAI, ILogger<Conversation> logger, UserManager<IdentityUser>? users = null)
        {
            this.speech = speech;
            this.openAI = openAI;
            this.users = users;
            this.logger = logger;
        }

        private static string ConstructPrompt(string botName, IEnumerable<string> people, string botResponseStyle, string? languageName, string? detailPrompt)
        {
            var style = string.IsNullOrEmpty(botResponseStyle)
                ? "neutral"
                : botResponseStyle;

            var peopleString = FormatPeopleString(people.ToList(), botName);

            var promptParts = new[]
                {
                    $"We are in a conversation between {peopleString}.",
                    $@"Your name is {botName}. You should respond in a ""{style}"" style. Don't tell me your emotional state before giving me your statement.",
                    $"If I change languages, you should change with me. I am currently speaking in {languageName}.",
                    detailPrompt?.Trim()
                };

            return string.Join("\n", promptParts.Where(s => !string.IsNullOrEmpty(s)));
        }

        private static string FormatPeopleString(List<string> people, string? botName)
        {
            int index = people.FindIndex(x => x?.Equals(botName, StringComparison.OrdinalIgnoreCase) == true);
            if (index > -1)
            {
                people.RemoveAt(index);
            }
            people.Insert(0, "you");
            people.Add("me");

            var peopleSB = new StringBuilder();
            if (people.Count > 1)
            {
                for (var i = 0; i < people.Count; ++i)
                {
                    if (i > 0)
                    {
                        peopleSB.Append(", ");
                    }

                    if (i == people.Count - 1)
                    {
                        peopleSB.Append("and ");
                    }

                    peopleSB.Append(people[i]);
                }
            }

            return peopleSB.ToString();
        }

        [HttpGet("token")]
        public IActionResult GetToken()
        {
            return new ObjectResult(new[]{
                speech.SubscriptionKey,
                speech.Region
            });
        }


        [HttpGet("voices")]
        public async Task<IActionResult> GetVoices()
        {
            var voices = await speech.GetVoicesAsync();
            Response.RegisterForDispose(voices);
            foreach (var voice in voices.Voices)
            {
                Response.RegisterForDispose(voice);
            }

            return new ObjectResult(voices.Voices);
        }

        public class ListenInput : SingleFormFile
        {
            public string? SpeakerCulture { get; set; }
            public string? TargetCulture { get; set; }
        }

        [HttpPost("listen")]
        public async Task<IActionResult> SpeechToText([FromForm] ListenInput input)
        {
            try
            {
                var response = await speech.RecognizeAsync(input.FormFile, input.SpeakerCulture, input.TargetCulture);
                Response.Headers.Add("X-Recognized-Language", Uri.EscapeDataString(response.Culture));
                Response.Headers.Add("X-Recognized-Text", Uri.EscapeDataString(response.Text));
                return new ObjectResult(response);
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "In method {name}", nameof(SpeechToText));
                return new BadRequestResult();
            }
        }


        public class SpeakInput
        {
            public string? Voice { get; set; }
            public string? Style { get; set; }
            public string? Text { get; set; }
        }

        [HttpPost("speak")]
        public async Task<IActionResult> TextToSpeech([FromBody] SpeakInput input)
        {
            try
            {
                var accepts = Request.Headers.Accept;
                var acceptEmpty = accepts.Empty();
                var acceptAny = accepts.Any(s => s == MediaType.Audio.AnyAudio);
                var acceptWEBM = accepts.Any(s => s == MediaType.Audio_WebMOpus);
                var acceptMP3 = accepts.Any(s => s == MediaType.Audio_Mpeg);
                var acceptWAV = accepts.Any(s => s == MediaType.Audio_Wav);

                var format = acceptEmpty || acceptAny || acceptWEBM
                    ? EZFFMPEGFormat.WebMOpus
                    : acceptMP3
                        ? EZFFMPEGFormat.MP3
                        : acceptWAV
                            ? EZFFMPEGFormat.Wav
                            : throw new ArgumentException($"The Accept header doesn't indicate a usable format");

                if (input.Text is not null)
                {
                    Response.Headers.Add("X-Synthesized-Text", Uri.EscapeDataString(input.Text));
                }

                var result = await speech.SynthesizeAsync(input.Voice, input.Style, input.Text);
                Response.RegisterForDispose(result.File);
                var stream = result.File.OpenRead();
                Response.RegisterForDispose(stream);
                var visemeJson = System.Text.Json.JsonSerializer.Serialize(result.Visemes);
                Response.Headers.Add("X-Visemes", Uri.EscapeDataString(visemeJson));
                return File(stream, result.File.MediaType);
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "In method {name}", nameof(TextToSpeech));
                return new BadRequestResult();
            }
        }

        public record ConverationLineInput(
            string? Name,
            string? Text);

        public record ConversationInput(
            string? Prompt,
            IEnumerable<ConverationLineInput>? Messages,
            string? CharacterName,
            string? Style,
            string? LanguageName);

        [HttpPost("davinci")]
        public async Task<IActionResult> GetDavinciResponseAsync([FromBody] ConversationInput input)
        {
            try
            {
                if (input?.Messages is null) throw new ArgumentException(null, nameof(input));

                var people = input.Messages
                        .Select(m => m.Name ?? "BOT")
                        .Distinct();

                var context = string.Join("", input.Messages
                        .Select(m => $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));

                var character = input.CharacterName ?? "BOT";
                var style = input.Style ?? "";

                var prompt = ConstructPrompt(character, people, character, input.LanguageName, input.Prompt);
                prompt += context;

                logger.LogInformation("\n============================\n{prompt}\n============================\n", prompt);

                Response.Headers.Add("x-prompt-text", Uri.EscapeDataString(prompt));

                string? userID = null;
                if (users is not null)
                {
                    var user = await users.GetUserAsync(User);
                    userID = user?.Id;
                }

                var request = new CompletionCreateRequest
                {
                    Model = OpenAI.GPT3.ObjectModels.Models.TextDavinciV3,
                    User = userID,
                    Temperature = 0.75f,
                    MaxTokens = 250,
                    FrequencyPenalty = 0.5f,
                    PresencePenalty = 0.25f,
                    Prompt = prompt
                };

                var result = await Retry.Times(
                    3,
                    () => openAI.Completions.CreateCompletion(request),
                    (r) => r?.Successful == true,
                    (r) => $"[{r.Error?.Code}] <{r.Error?.Type}> ({r.Error?.Param}): {r.Error?.Message}");

                var text = result.Choices
                    .Select(c => c.Text.Trim())
                    .FirstOrDefault();

                if (text is not null)
                {
                    var prefix = $"{character.ToUpperInvariant()}:";
                    if (text.StartsWith(prefix))
                    {
                        text = text[prefix.Length..].Trim();
                    }
                    Response.Headers.Add("X-Generated-Text", Uri.EscapeDataString(text));
                    return new ObjectResult(text);
                }
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "In method {name}", nameof(GetDavinciResponseAsync));
            }

            return BadRequest();
        }

        [HttpPost("chatgpt")]
        public async Task<IActionResult> GetChatGPTResponseAsync([FromBody] ConversationInput input)
        {
            try
            {
                if (input?.Messages is null) throw new ArgumentException(null, nameof(input));

                var people = input.Messages
                        .Select(m => m.Name ?? "BOT")
                        .Distinct();

                var character = input.CharacterName ?? "BOT";
                var style = input.Style ?? "";

                var prompt = ConstructPrompt(character, people, character, input.LanguageName, input.Prompt);

                var context = string.Join("", input.Messages
                        .Select(m => $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));

                var messages = new List<ChatMessage>
                {
                    new ChatMessage(StaticValues.ChatMessageRoles.System, prompt)
                };

                foreach (var m in input.Messages)
                {
                    messages.Add(new ChatMessage(
                        m.Name?.ToUpperInvariant() == "ME"
                            ? StaticValues.ChatMessageRoles.User
                            : StaticValues.ChatMessageRoles.Assistant,
                        $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));
                }

                prompt += context;

                logger.LogInformation("\n============================\n{prompt}\n============================\n", prompt);

                Response.Headers.Add("x-prompt-text", Uri.EscapeDataString(prompt));

                string? userID = null;
                if (users is not null)
                {
                    var user = await users.GetUserAsync(User);
                    userID = user?.Id;
                }

                var request = new ChatCompletionCreateRequest
                {
                    Model = OpenAI.GPT3.ObjectModels.Models.ChatGpt3_5Turbo,
                    User = userID ?? "",
                    Temperature = 0.75f,
                    MaxTokens = 250,
                    FrequencyPenalty = 0.5f,
                    PresencePenalty = 0.25f,
                    Messages = messages
                };

                var result = await Retry.Times(
                    3,
                    () => openAI.ChatCompletion.CreateCompletion(request),
                    (r) => r?.Successful == true,
                    (r) => $"[{r.Error?.Code}] <{r.Error?.Type}> ({r.Error?.Param}): {r.Error?.Message}");

                var text = result.Choices
                    .Select(c => c.Message.Content)
                    .FirstOrDefault();

                if (text is not null)
                {
                    var prefix = $"{character.ToUpperInvariant()}:";
                    if (text.StartsWith(prefix))
                    {
                        text = text[prefix.Length..].Trim();
                    }
                    Response.Headers.Add("X-Generated-Text", Uri.EscapeDataString(text));
                    return new ObjectResult(text);
                }
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "In method {name}", nameof(GetChatGPTResponseAsync));
            }

            return new BadRequestResult();
        }

        [HttpPost("gpt4")]
        public async Task<IActionResult> GetGPT4ResponseAsync([FromBody] ConversationInput input)
        {
            try
            {
                if (input?.Messages is null) throw new ArgumentException(null, nameof(input));

                var people = input.Messages
                        .Select(m => m.Name ?? "BOT")
                        .Distinct();

                var character = input.CharacterName ?? "BOT";
                var style = input.Style ?? "";

                var prompt = ConstructPrompt(character, people, character, input.LanguageName, input.Prompt);

                var context = string.Join("", input.Messages
                        .Select(m => $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));

                var messages = new List<ChatMessage>
                {
                    new ChatMessage(StaticValues.ChatMessageRoles.System, prompt)
                };

                foreach (var m in input.Messages)
                {
                    messages.Add(new ChatMessage(
                        m.Name?.ToUpperInvariant() == "ME"
                            ? StaticValues.ChatMessageRoles.User
                            : StaticValues.ChatMessageRoles.Assistant,
                        $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));
                }

                prompt += context;

                logger.LogInformation("\n============================\n{prompt}\n============================\n", prompt);

                Response.Headers.Add("x-prompt-text", Uri.EscapeDataString(prompt));

                string? userID = null;
                if (users is not null)
                {
                    var user = await users.GetUserAsync(User);
                    userID = user?.Id;
                }

                var request = new ChatCompletionCreateRequest
                {
                    Model = OpenAI.GPT3.ObjectModels.Models.Gpt_4,
                    User = userID ?? "",
                    Temperature = 0.75f,
                    MaxTokens = 250,
                    FrequencyPenalty = 0.5f,
                    PresencePenalty = 0.25f,
                    Messages = messages
                };

                var result = await Retry.Times(
                    3,
                    () => openAI.ChatCompletion.CreateCompletion(request),
                    (r) => r?.Successful == true,
                    (r) => $"[{r.Error?.Code}] <{r.Error?.Type}> ({r.Error?.Param}): {r.Error?.Message}");

                var text = result.Choices
                    .Select(c => c.Message.Content)
                    .FirstOrDefault();

                if (text is not null)
                {
                    var prefix = $"{character.ToUpperInvariant()}:";
                    if (text.StartsWith(prefix))
                    {
                        text =text[prefix.Length..].Trim();
                    }
                    Response.Headers.Add("X-Generated-Text", Uri.EscapeDataString(text));
                    return new ObjectResult(text);
                }
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "In method {name}", nameof(GetChatGPTResponseAsync));
            }

            return new BadRequestResult();
        }
    }
}