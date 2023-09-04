using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.Services;
using Juniper.TSBuild;

if (args.Any(arg => arg.StartsWith("--")))
{
    await BuildSystem<SeanMcBeth.BuildConfig>.Run(args);
}
else
{
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
}