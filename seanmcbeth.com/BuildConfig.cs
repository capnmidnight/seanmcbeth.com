using Juniper.TSBuild;

namespace SeanMcBeth
{
    public class BuildConfig : IBuildConfig
    {
        private const string ProjectName = "seanmcbeth.com";

        private static readonly string[] FilePatterns =
        {
            "description.txt",
            "index.html",
            "name.txt",
            "thumbnail.jpg",
            "screenshot.jpg",
            "logo.png",
            "logo_small.png",
            "*.bool"
        };

        public BuildConfig()
        {
            var workingDir = new DirectoryInfo(".");
            var here = workingDir.GoUpUntil(here => here.CD(ProjectName, "src").Exists)
                ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);

            var juniperDir = here.CD("Juniper");
            var projectDir = here.CD(ProjectName);
            var nodeModules = projectDir.CD("node_modules");
            var tsInput = projectDir.CD("src");
            var wwwRoot = projectDir.CD("wwwroot");
            var jsOutput = wwwRoot.CD("js");
            var modelOutput = wwwRoot.CD("models");
            var audioOutput = wwwRoot.CD("audio");
            var imgOutput = wwwRoot.CD("img");
            var uiImgOUtput = imgOutput.CD("ui");

            var pathHelper = new PathHelper(juniperDir, nodeModules);
            var keyFile = new DirectoryInfo(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile))
                .CD(".ssh")
                .Touch("sean-mcbeth.pem");

            Options = new BuildSystemOptions
            {
                CleanDirs = new[]
                {
                    jsOutput
                },
                InProject= projectDir,
                OutProject = projectDir,
                Deployment = new DeploymentOptions(
                    "seanmcbeth.com",
                    "smcbeth",
                    keyFile,
                    "SeanMcBeth.Site"),
                BannedDependencies = new[]
                {
                    ("pdfjs-dist", "2.15.349", "Internal KeyboardManager does not work on old Oculus for Business Quest 2s. Use 2.14.305 instead.")
                },
                Dependencies = new List<BuildSystemDependency>()
                {
                    pathHelper.CursorModel.MakeDependency(modelOutput),
                    pathHelper.WatchModel.MakeDependency(modelOutput),

                    pathHelper.ForestGroundModel.MakeDependency(modelOutput),
                    pathHelper.ForestTreeModel.MakeDependency(modelOutput),

                    pathHelper.ForestAudio.MakeDependency(audioOutput),
                    pathHelper.StarTrekComputerBeep55Audio.MakeDependency(audioOutput),
                    pathHelper.FootStepsAudio.MakeDependency(audioOutput),
                    pathHelper.ButtonPressAudio.MakeDependency(audioOutput),
                    pathHelper.DoorOpenAudio.MakeDependency(audioOutput),
                    pathHelper.DoorCloseAudio.MakeDependency(audioOutput),
                    pathHelper.UIDraggedAudio.MakeDependency(audioOutput),
                    pathHelper.UIEnterAudio.MakeDependency(audioOutput),
                    pathHelper.UIErrorAudio.MakeDependency(audioOutput),
                    pathHelper.UIExitAudio.MakeDependency(audioOutput)
                },
                OptionalDependencies = CopyMetaFiles("apps", tsInput, jsOutput)
                    .Union(CopyMetaFiles("tests", tsInput, jsOutput))
            };

            pathHelper.AddUITextures(Options, uiImgOUtput);
        }

        public BuildSystemOptions Options { get; }

        private static IEnumerable<BuildSystemDependency> CopyMetaFiles(string subName, DirectoryInfo jsInput, DirectoryInfo jsOutput)
        {
            foreach (var appInDir in jsInput.CD(subName).EnumerateDirectories())
            {
                if (appInDir.Touch("index.ts").Exists)
                {
                    var appOutDir = jsOutput.CD(subName, appInDir.Name);
                    foreach (var pattern in FilePatterns)
                    {
                        var files = appInDir.GetFiles(pattern);
                        foreach (var file in files)
                        {
                            yield return file.MakeDependency(appOutDir);
                        }
                    }
                }
            }
        }
    }
}