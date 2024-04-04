using Juniper.Azure;
using Juniper.OpenAI;
using Juniper.Services;
using Juniper.TSBuild;

if (args.Contains("--build"))
{
    await new BuildSystem<SeanMcBeth.BuildConfig>().BuildAsync(CancellationToken.None);
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