using Juniper.TSBuild;

using System.IO;

namespace ImageViewer;

public class BuildConfig : IBuildConfig
{
    private const string ProjectName = "ImageViewer";

    public BuildConfig()
    {
        var workingDir = new DirectoryInfo(".");
        var here = workingDir.GoUpUntil(here => here.CD(ProjectName, "src").Exists)
            ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);

        Options = new BuildSystemOptions
        {
            CleanDirs = new[]
            {
                here.CD(ProjectName, "wwwroot", "js")
            },
            InProjectName = ProjectName,
            OutProjectName = ProjectName
        };
    }

    public BuildSystemOptions Options { get; }
}