using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.Services;

await WebApplication.CreateBuilder(args)
    .UseSystemd()
    .ConfigureJuniperWebApplication()
    .AddJuniperBuildSystem<SeanMcBeth.BuildConfig>()
    .AddJuniperHTTPClient()
    .AddJuniperSpeechService("Azure:Speech")
    .AddJuniperOpenAI("OpenAI")
    .Build()
    .ConfigureJuniperRequestPipeline()
    .BuildAndRunAsync();