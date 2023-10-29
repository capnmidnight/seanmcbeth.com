using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildRunOptions.IsBuildCommand(args))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    var builder = WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>();

    if (!AppShellConfiguration.NoAppShell)
    {
        builder.ConfigureJuniperAppShell<GtkAppShellFactory>();
    }
    var app = builder.AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline();

    if (AppShellConfiguration.NoAppShell)
    {
        app.BuildAndRunAsync().Wait();
    }
    else
    {
        app.BuildAndStartAsync().Wait();
        Gtk.Application.Run();
    }
}