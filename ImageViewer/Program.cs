using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildRunOptions.IsBuildCommand(args))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .ConfigureJuniperAppShell<GtkAppShellFactory>()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline()
        .BuildAndStartAsync()
        .Wait();
        
    Gtk.Application.Run();
}