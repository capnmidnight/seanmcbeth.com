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
#if LINUX
        builder.ConfigureJuniperAppShell<GtkAppShellFactory>();
#elif WINDOWS
        builder.ConfigureJuniperAppShell<WpfAppShellFactory>();
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
#if LINUX
        app.BuildAndStartAsync().Wait();
        Gtk.Application.Run();
#elif WINDOWS
        app.BuildAndRunAsync().Wait();
#endif
    }
}