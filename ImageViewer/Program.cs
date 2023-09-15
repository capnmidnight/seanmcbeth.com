using Juniper.Services;
using Juniper.TSBuild;
using Juniper.AppShell;
using System.IO;

var here = new DirectoryInfo(Directory.GetCurrentDirectory());

if (BuildOptions.IsBuildCommand(args))
{
    await BuildSystem<ImageViewer.BuildConfig>.Run(args);
}
else
{
    var app = WebApplication.CreateBuilder(args)
        .ConfigureJuniperWebApplication()
        .ConfigureJuniperAppShell<WpfAppShellFactory<WpfAppShell>>()
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline();

    await Task.WhenAll(
        app.StartAppShellAsync("Image Viewer", "splash.html", here.CD("wwwroot", "images").Touch("marigold_small_transparent.png").FullName),
        app.BuildAsync()
    );

    await app.RunAppShellAsync();
}