using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildRunOptions.IsBuildCommand(args))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    var webApp = WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .ConfigureJuniperAppShell<GtkAppShellFactory>()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline();

    webApp.BuildAndStartAsync().Wait();

    var appShellFactory = webApp.Services.GetRequiredService<IAppShellFactory>();
    if (appShellFactory is GtkAppShellFactory gtkFactory)
    {
        gtkFactory.Run();
    }
}