using Juniper;
using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.TSBuild;

if (args.Contains("--build"))
{
    await BuildSystem<SeanMcBeth.BuildConfig>.Run(args);
}
else
{
    await WebApplication.CreateBuilder(args)
    .AddJuniperBuildSystem<SeanMcBeth.BuildConfig>()
    .AddJuniperServices()
    .AddHttpClient("HTTP")
    .AddJuniperSpeechService()
    .AddJuniperOpenAI()
    .Build()
    .UseJuniperRequestPipeline()
    .BuildAndRunAsync();
}