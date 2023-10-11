using Juniper.TSBuild;

using System.IO;

namespace ImageViewer;

public class BuildConfig : IBuildConfig
{
    private const string ProjectName = "ImageViewer";

    public BuildConfig()
    {
        var workingDir = new DirectoryInfo(".");
        var here = workingDir.GoUpUntil(here => here.CD(ProjectName).Exists)
            ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);
        here = here.CD(ProjectName);

        Options = new BuildSystemOptions
        {
            Project = here,
            CleanDirs = new[]
            {
                here.CD("wwwroot", "js")
            },
            SkipPreBuild = true
        };
    }

    public BuildSystemOptions Options { get; }
}