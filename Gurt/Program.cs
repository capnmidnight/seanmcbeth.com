using Juniper;
using Juniper.AppShell;
using Juniper.Services;
using Juniper.TSBuild;

var builder = WebApplication.CreateBuilder(args)
    .AddJuniperServices()
    .AddJuniperBuildSystem<Gurt.BuildConfig>();

if (!AppShellConfiguration.NoAppShell)
{
#if WINDOWS
    builder.AddJuniperAppShell<WpfAppShellFactory>();
#else
        builder.AddJuniperAppShell<AvaloniaAppShellFactory>();
#endif
}

builder.AddHttpClient("Main")
    .Build()
    .UseJuniperRequestPipeline()
    .BuildAndRunAsync()
    .Wait();