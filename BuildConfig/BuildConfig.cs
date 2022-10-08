using Juniper.TSBuild;

namespace SeanMcBeth
{
    public static class BuildConfig
    {
        private const string ServerProjectName = "Personal Site";
        private const string ScriptProjectName = "TypeScript Code";

        private static readonly string[] FilePatterns =
        {
            "description.txt",
            "name.txt",
            "thumbnail.jpg",
            "screenshot.jpg",
            "logo.png",
            "logo_small.png",
            "*.bool"
        };

        public static BuildSystemOptions GetBuildConfig()
        {
            var workingDir = new DirectoryInfo(".");
            var here = workingDir;
            while (here is not null && !here.CD(ScriptProjectName, "src").Exists)
            {
                here = here.Parent;
            }

            if (here is null)
            {
                throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);
            }


            var juniperAssets = here.CD("Juniper", "etc", "Assets");
            var projectInDir = here.CD(ScriptProjectName);
            var projectOutDir = here.CD(ServerProjectName);
            var nodeModules = projectInDir.CD("node_modules");
            var threeJsIn = nodeModules.CD("three", "build");
            var wwwRoot = projectOutDir.CD("wwwroot");
            var jsInput = projectInDir.CD("src");
            var jsOutput = wwwRoot.CD("js");
            var threeJsOut = jsOutput.CD("three");
            var modelOutput = wwwRoot.CD("models");
            var audioOutput = wwwRoot.CD("audio");
            var imgOutput = wwwRoot.CD("img");
            var uiImgOUtput = imgOutput.CD("ui");
            var juniperTextures = juniperAssets.CD("Textures");
            var juniperAudio = juniperAssets.CD("Audio");
            var juniperModels = juniperAssets.CD("Models");
            var juniperModelsForest = juniperModels.CD("Forest");

            var options = new BuildSystemOptions()
            {
                CleanDirs = new[] { jsOutput },
                InProjectName = ScriptProjectName,
                OutProjectName = ServerProjectName,
                Dependencies = new()
                    {
                        { "Three.js", (threeJsIn.Touch("three.js"), threeJsOut.Touch("index.js")) },
                        { "Three.js min", (threeJsIn.Touch("three.min.js"), threeJsOut.Touch("index.min.js")) },
                        { "Cursor", (juniperModels.CD("Cursors").Touch("Cursors.glb"), modelOutput.Touch("Cursors.glb")) },
                        { "Forest Ground", (juniperModelsForest.Touch("Forest-Ground.glb"), modelOutput.Touch("Forest-Ground.glb")) },
                        { "Forest Tree", (juniperModelsForest.Touch("Forest-Tree.glb"), modelOutput.Touch("Forest-Tree.glb")) },
                        { "Forest Audio", (juniperAudio.Touch("forest.mp3"),  audioOutput.Touch("forest.mp3")) },
                        { "Test Audio", (juniperAudio.CD("Star Trek").Touch("computerbeep_55.mp3"),  audioOutput.Touch("test-clip.mp3")) },
                        { "Footsteps", (juniperAudio.Touch("footsteps_fast.mp3"),  audioOutput.Touch("footsteps.mp3")) },
                        { "Button Press", (juniperAudio.Touch("vintage_radio_button_pressed.mp3"),  audioOutput.Touch("vintage_radio_button_pressed.mp3")) },
                        { "Door Open", (juniperAudio.Touch("door_open.mp3"),  audioOutput.Touch("door_open.mp3")) },
                        { "Door Close", (juniperAudio.Touch("door_close.mp3"),  audioOutput.Touch("door_close.mp3")) },
                        { "UI Dragged", (juniperAudio.Touch("basic_dragged.mp3"),  audioOutput.Touch("basic_dragged.mp3")) },
                        { "UI Enter", (juniperAudio.Touch("basic_enter.mp3"),  audioOutput.Touch("basic_enter.mp3")) },
                        { "UI Error", (juniperAudio.Touch("basic_error.mp3"),  audioOutput.Touch("basic_error.mp3")) },
                        { "UI Exit", (juniperAudio.Touch("basic_exit.mp3"),  audioOutput.Touch("basic_exit.mp3")) }
                    }
            };

            foreach (var file in juniperTextures.CD("UI").EnumerateFiles())
            {
                options.Dependencies.Add(file.Name, (file, uiImgOUtput.Touch(file.Name)));
            }

            options.OptionalDependencies = new();

            foreach (var appInDir in jsInput.EnumerateDirectories())
            {
                if (appInDir.Name.EndsWith("-app")
                    && appInDir.Touch("index.ts").Exists)
                {
                    var appOutDir = jsOutput.CD(appInDir.Name);
                    foreach (var pattern in FilePatterns)
                    {
                        var files = appInDir.GetFiles(pattern);
                        foreach (var file in files)
                        {
                            options.OptionalDependencies.Add(
                                    $"{appInDir.Name} {Path.GetFileNameWithoutExtension(file.Name)}",
                                    (file, appOutDir.Touch(file.Name)));
                        }
                    }
                }
            }

            return options;
        }
    }
}