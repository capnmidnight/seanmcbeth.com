using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildOptions.IsBuildCommand(args))
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