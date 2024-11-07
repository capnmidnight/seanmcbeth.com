using Juniper;
using Juniper.AppShell;

var builder = WebApplication.CreateBuilder(args);

if (!AppShellConfiguration.NoAppShell)
{
#if WINDOWS
    builder.AddJuniperAppShell<WpfAppShellFactory>();
#else
        builder.AddJuniperAppShell<AvaloniaAppShellFactory>();
#endif
}

builder
    .AddJuniperBuildSystem<Gurt.BuildConfig>()
    .AddJuniperServices()
    .Build()
    .UseJuniperRequestPipeline()
    .BuildAndRunAsync()
    .Wait();