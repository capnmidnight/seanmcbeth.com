using Juniper.Services;
using Juniper.TSBuild;
using Juniper.AppShell;

if (args.Any(arg => arg.StartsWith("--")))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    var app = WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .ConfigureJuniperAppShell<WpfAppShellFactory>()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline();

    await Task.WhenAll(
        app.StartAppShellAsync("Image Viewer", "splash.html"),
        app.BuildAsync()
    );

    await app.RunAppShellAsync();
}