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
            var here = BuildSystemOptions.FindSolutionRoot(ProjectName);
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

            var pathHelper = new JuniperAssetHelper(juniperDir);

            Options = new BuildSystemOptions
            {
                Project = projectDir,
                CleanDirs =
                [
                    jsOutput
                ],
                Dependencies =
                [
                    pathHelper.Models.Cursors.CopyFile(modelOutput),
                    pathHelper.Models.Watch.CopyFile(modelOutput),

                    pathHelper.Models.ForestGround.CopyFile(modelOutput),
                    pathHelper.Models.ForestTree.CopyFile(modelOutput),

                    pathHelper.Audios.Forest.CopyFile(audioOutput),
                    pathHelper.Audios.StarTrek.ComputerBeep55.CopyFile(audioOutput),
                    pathHelper.Audios.FootStepsFast.CopyFile(audioOutput),
                    pathHelper.Audios.ButtonPress.CopyFile(audioOutput),
                    pathHelper.Audios.DoorOpen.CopyFile(audioOutput),
                    pathHelper.Audios.DoorClose.CopyFile(audioOutput),
                    pathHelper.Audios.UIDragged.CopyFile(audioOutput),
                    pathHelper.Audios.UIEnter.CopyFile(audioOutput),
                    pathHelper.Audios.UIError.CopyFile(audioOutput),
                    pathHelper.Audios.UIExit.CopyFile(audioOutput),

                    threeJS.CopyFile(jsOutput.CD("libs"))
                ],
                OptionalDependencies = [
                    ..CopyMetaFiles("apps", tsInput, jsOutput),
                    ..CopyMetaFiles("tests", tsInput, jsOutput)
                ],
                AdditionalNPMProjects =
                [
                ]
            };

            pathHelper.Textures.AddUITextures(Options, uiImgOUtput);
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
                            yield return file.CopyFile(appOutDir);
                        }
                    }
                }
            }
        }
    }
}