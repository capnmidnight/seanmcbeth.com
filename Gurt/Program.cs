using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

if (BuildRunOptions.IsBuildCommand(args))
{
    await BuildSystem<Gurt.BuildConfig>.Run(args);
}
else
{
    var builder = WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .AddJuniperBuildSystem<Gurt.BuildConfig>();

    if (!AppShellConfiguration.NoAppShell)
    {
#if WINDOWS
        builder.ConfigureJuniperAppShell<WpfAppShellFactory>();
#else
        builder.ConfigureJuniperAppShell<GtkAppShellFactory>();
#endif
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
#if WINDOWS
        app.BuildAndRunAsync().Wait();
#else
        app.BuildAndStartAsync().Wait();
        Gtk.Application.Run();
#endif
    }
}