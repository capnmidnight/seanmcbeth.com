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
        .ConfigureJuniperAppShell<WpfAppShellFactory<WpfAppShell>>(new AppShellOptions { 
            SplashScreenPath = "splash.html",
            Window = new()
            {
                Title = "Image Viewer",
                Size = new()
                {
                    Width = 1920,
                    Height =1080
                }
            }
        })
        .AddJuniperBuildSystem<ImageViewer.BuildConfig>()
        .AddJuniperHTTPClient()
        .Build()
        .ConfigureJuniperRequestPipeline()
        .BuildAndRunAsync();
}