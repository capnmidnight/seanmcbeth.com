using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildRunOptions.IsBuildCommand(args))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    await WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .ConfigureJuniperAppShell<GtkAppShellFactory<GtkAppShell>>()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline()
        .BuildAndRunAsync();
}