using Juniper.TSBuild;

namespace Gurt;

public class BuildConfig : IBuildConfig
{
    private const string ProjectName = "Gurt";

    public BuildSystemOptions Options
    {
        get
        {
            var workingDir = new DirectoryInfo(".");
            var here = workingDir.GoUpUntil(here => here.CD(ProjectName).Exists)
                ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);
            var project = here.CD(ProjectName);
            var projectScriptOutput = project.CD("wwwroot", "js");

            return new BuildSystemOptions
            {
                Project = project,
                CleanDirs = new[] { projectScriptOutput }
            };
        }
    }
}