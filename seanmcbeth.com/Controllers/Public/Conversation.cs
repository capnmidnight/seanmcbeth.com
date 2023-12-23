// Ignore Spelling: Davinci

using Juniper;
using Juniper.Azure;
using Juniper.HTTP;
using Juniper.Logic;
using Juniper.Sound;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OpenAI.Interfaces;
using OpenAI.ObjectModels;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels.ResponseModels;
using OpenAI.ObjectModels.SharedModels;

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

        private static IEnumerable<string> ConstructPrompt(string botName, IEnumerable<string> people, string botResponseStyle, string? languageName, string? detailPrompt)
        {
            var style = string.IsNullOrEmpty(botResponseStyle)
                ? "neutral"
                : botResponseStyle;

            var peopleString = FormatPeopleString(people.ToList(), botName);

            yield return $"We are in a conversation between {peopleString}.";
            yield return $@"Your name is {botName}. You should respond in a ""{style}"" style. Don't tell me your emotional state before giving me your statement.";
            yield return $"If I change languages, you should change with me. I am currently speaking in {languageName}. Don't mention anything about switching languages.";

            detailPrompt = detailPrompt?.Trim() ?? "";
            if (detailPrompt.Length > 0)
            {
                yield return detailPrompt;
            }
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

        public record ConversationLineInput(
            string? Name,
            string? Text);

        public record ConversationInput(
            string? Prompt,
            IEnumerable<ConversationLineInput>? Messages,
            string? CharacterName,
            string? Style,
            string? LanguageName);

        private async Task<IActionResult> Do<RequestT, ResponseT, ChoiceT>([FromBody] ConversationInput input,
            Func<string[], string?, RequestT> createRequest,
            Func<RequestT, Task<ResponseT>> getResponse,
            Func<ResponseT, List<ChoiceT>> getChoices,
            Func<ChoiceT, string> getChoiceText)
            where RequestT : class, IOpenAiModels.ITemperature, IOpenAiModels.IModel, IOpenAiModels.IUser
            where ResponseT : BaseResponse
        {
            try
            {
                if (input?.Messages is null) throw new ArgumentException(null, nameof(input));

                string? userID = null;
                if (users is not null)
                {
                    var user = await users.GetUserAsync(User);
                    userID = user?.Id;
                }

                var people = input.Messages
                        .Select(m => m.Name ?? "BOT")
                        .Distinct();

                var character = input.CharacterName ?? "BOT";
                var style = input.Style ?? "";

                var prompt = ConstructPrompt(character, people, character, input.LanguageName, input.Prompt).ToArray();

                var context = string.Join("\n", input.Messages
                        .Select(m => $"{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));

                var request = createRequest(prompt, userID);

                var promptDebug = string.Join("\n", prompt) + "\n" + context;
                logger.LogInformation("\n============================\n{prompt}\n============================\n", promptDebug);
                Response.Headers.Add("x-prompt-text", Uri.EscapeDataString(promptDebug));

                var result = await Retry.Times(
                    3,
                    () => getResponse(request),
                    (r) => r?.Successful == true,
                    (r) => $"[{r.Error?.Code}] <{r.Error?.Type}> ({r.Error?.Param}): {r.Error?.Message}");

                var choices = getChoices(result);

                var text = choices
                    .Select(getChoiceText)
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

        private Task<IActionResult> DoGPT3(string model, ConversationInput input) =>
            Do(
                input,
                (prompts, userID) => new CompletionCreateRequest
                {
                    Model = model,
                    User = userID,
                    Temperature = 0.75f,
                    MaxTokens = 250,
                    FrequencyPenalty = 0.5f,
                    PresencePenalty = 0.25f,
                    Prompt = string.Join("\n", prompts)
                },
                request => openAI.Completions.CreateCompletion(request),
                response => response.Choices,
                choice => choice.Text.Trim());

        private Task<IActionResult> DoGPT4(string model, [FromBody] ConversationInput input) =>
            Do(
                input,
                (prompts, userID) =>
                {
                    var messages = prompts
                        .Select(prompt => new ChatMessage(StaticValues.ChatMessageRoles.System, prompt))
                        .ToList();

                    if (input.Messages is not null)
                    {
                        foreach (var m in input.Messages)
                        {
                            messages.Add(new ChatMessage(
                                m.Name?.ToUpperInvariant() == "ME"
                                    ? StaticValues.ChatMessageRoles.User
                                    : StaticValues.ChatMessageRoles.Assistant,
                                $"\n{m.Name?.ToUpperInvariant()}: {m.Text ?? ""}"));
                        }
                    }

                    return new ChatCompletionCreateRequest
                    {
                        Model = model,
                        User = userID ?? "",
                        Temperature = 0.75f,
                        MaxTokens = 250,
                        FrequencyPenalty = 0.5f,
                        PresencePenalty = 0.25f,
                        Messages = messages
                    };
                },
                request => openAI.ChatCompletion.CreateCompletion(request),
                response => response.Choices,
                choice => choice.Message.Content);

        [HttpPost("ada")]
        public Task<IActionResult> GetAdaResponseAsync([FromBody] ConversationInput input) =>
            DoGPT3(OpenAI.ObjectModels.Models.TextAdaV1, input);

        [HttpPost("babbage")]
        public Task<IActionResult> GetBabbageResponseAsync([FromBody] ConversationInput input) =>
            DoGPT3(OpenAI.ObjectModels.Models.TextBabbageV1, input);

        [HttpPost("curie")]
        public Task<IActionResult> GetCurieResponseAsync([FromBody] ConversationInput input) =>
            DoGPT3(OpenAI.ObjectModels.Models.TextCurieV1, input);

        [HttpPost("davinci")]
        public Task<IActionResult> GetDavinciResponseAsync([FromBody] ConversationInput input) =>
            DoGPT3(OpenAI.ObjectModels.Models.TextDavinciV3, input);

        [HttpPost("chatgpt")]
        public Task<IActionResult> GetChatGPTResponseAsync([FromBody] ConversationInput input) =>
            DoGPT4(OpenAI.ObjectModels.Models.Gpt_3_5_Turbo, input);

        [HttpPost("gpt4")]
        public Task<IActionResult> GetGPT4ResponseAsync([FromBody] ConversationInput input) =>
            DoGPT4(OpenAI.ObjectModels.Models.Gpt_4, input);
    }
}