using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.Services;

var builder = WebApplication.CreateBuilder(args);

await builder
    .UseSystemd()
    .ConfigureJuniperBuildSystem<SeanMcBeth.BuildConfig>()
    .ConfigureJuniperWebApplication()
    .ConfigureJuniperHTTPClient()
    .ConfigureJuniperSpeechService(builder.Configuration.GetSection("Azure:Speech"))
    .ConfigureJuniperOpenAI(builder.Configuration.GetSection("OpenAI"))
    .Build()
    .ConfigureJuniperRequestPipeline()
    .RunAfterBuildAsync();