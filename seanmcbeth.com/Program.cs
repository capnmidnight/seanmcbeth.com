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
        .ConfigureJuniperSpeechService()
        .ConfigureJuniperOpenAI()
        .Build()
        .ConfigureJuniperRequestPipeline()
        .BuildAndRunAsync();
}