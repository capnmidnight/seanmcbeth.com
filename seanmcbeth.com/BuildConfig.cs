using Juniper.TSBuild;

namespace SeanMcBeth
{
    public class BuildConfig : IBuildConfig
    {
        private const string ProjectName = "seanmcbeth.com";

        private static readonly string[] FilePatterns =
        [
            "description.txt",
            "index.html",
            "name.txt",
            "thumbnail.jpg",
            "screenshot.jpg",
            "logo.png",
            "logo_small.png",
            "*.bool",
            "*.wgsl"
        ];

        public BuildConfig()
        {
            var workingDir = new DirectoryInfo(".");
            var here = workingDir.GoUpUntil(here => here.CD(ProjectName, "src").Exists)
                ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);

            var primroseDir = here.CD("Primrose/Primrose.TypeScript");
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
            var threeJS = nodeModules.CD("three", "build").Touch("three.module.js");

            var pathHelper = new PathHelper(juniperDir, nodeModules);

            Options = new BuildSystemOptions
            {
                Project = projectDir,
                CleanDirs =
                [
                    jsOutput
                ],
                SkipPreBuild = true,
                BannedDependencies =
                [
                    ("pdfjs-dist", "2.15.349", "Internal KeyboardManager does not work on old Oculus for Business Quest 2s. Use 2.14.305 instead.")
                ],
                Dependencies =
                [
                    pathHelper.CursorModel.CopyTo(modelOutput),
                    pathHelper.WatchModel.CopyTo(modelOutput),

                    pathHelper.ForestGroundModel.CopyTo(modelOutput),
                    pathHelper.ForestTreeModel.CopyTo(modelOutput),

                    pathHelper.ForestAudio.CopyTo(audioOutput),
                    pathHelper.StarTrekComputerBeep55Audio.CopyTo(audioOutput),
                    pathHelper.FootStepsAudio.CopyTo(audioOutput),
                    pathHelper.ButtonPressAudio.CopyTo(audioOutput),
                    pathHelper.DoorOpenAudio.CopyTo(audioOutput),
                    pathHelper.DoorCloseAudio.CopyTo(audioOutput),
                    pathHelper.UIDraggedAudio.CopyTo(audioOutput),
                    pathHelper.UIEnterAudio.CopyTo(audioOutput),
                    pathHelper.UIErrorAudio.CopyTo(audioOutput),
                    pathHelper.UIExitAudio.CopyTo(audioOutput),

                    threeJS.CopyTo(jsOutput.CD("libs"))
                ],
                OptionalDependencies = CopyMetaFiles("apps", tsInput, jsOutput)
                    .Union(CopyMetaFiles("tests", tsInput, jsOutput)),
                AdditionalNPMProjects =
                [
                    primroseDir,
                    juniperDir
                ]
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
                            yield return file.CopyTo(appOutDir);
                        }
                    }
                }
            }
        }
    }
}