using Juniper.TSBuild;

namespace SeanMcBeth
{
    public static class BuildConfig
    {
        public static readonly string ProjectName = "Personal Site";
        public static readonly BuildSystemOptions BuildSystemOptions;

        private static readonly string[] FilesToTry =
        {
            "description.txt",
            "thumbnail.jpg"
        };

        static BuildConfig()
        {
            var workingDir = new DirectoryInfo(".");
            var here = workingDir;
            while (here is not null && !here.CD(ProjectName, "src").Exists)
            {
                here = here.Parent;
            }

            if (here is not null)
            {
                var juniperAssets = here.CD("Juniper", "etc", "Assets");
                var projectDir = here.CD(ProjectName);
                var nodeModules = projectDir.CD("node_modules");
                var threeJsIn = nodeModules.CD("three", "build");
                var jsInput = projectDir.CD("src");
                var wwwRoot = projectDir.CD("wwwroot");
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

                BuildSystemOptions = new()
                {
                    Dependencies = new()
                    {
                        { "Three.js", (threeJsIn.Touch("three.js"), threeJsOut.Touch("index.js")) },
                        { "Three.js min", (threeJsIn.Touch("three.min.js"), threeJsOut.Touch("index.min.js")) },
                        { "Cursor", (juniperModels.CD("Cursors").Touch("Cursors.glb"), modelOutput.Touch("Cursors.glb")) },
                        { "Forest-Ground", (juniperModelsForest.Touch("Forest-Ground.glb"), modelOutput.Touch("Forest-Ground.glb")) },
                        { "Forest-Tree", (juniperModelsForest.Touch("Forest-Tree.glb"), modelOutput.Touch("Forest-Tree.glb")) },
                        { "Test Audio", (juniperAudio.CD("Star Trek").Touch("computerbeep_55.mp3"),  audioOutput.Touch("test-clip.mp3")) }
                    }
                };

                foreach(var file in juniperAudio.EnumerateFiles())
                {
                    if(file.Name.StartsWith("basic_")
                        && file.Extension == ".mp3")
                    {
                        BuildSystemOptions.Dependencies.Add("Audio: " + file.Name, (file, audioOutput.Touch(file.Name)));
                    }
                }

                foreach (var file in juniperTextures.CD("UI").EnumerateFiles())
                {
                    BuildSystemOptions.Dependencies.Add(file.Name, (file, uiImgOUtput.Touch(file.Name)));
                }

                foreach (var appInDir in jsInput.EnumerateDirectories())
                {
                    if (appInDir.Name.EndsWith("-app")
                        && appInDir.Touch("index.ts").Exists)
                    {
                        var appOutDir = jsOutput.CD(appInDir.Name);
                        foreach (var fileName in FilesToTry)
                        {
                            var file = appInDir.Touch(fileName);
                            BuildSystemOptions.Dependencies.Add(
                                $"{appInDir.Name} {Path.GetFileNameWithoutExtension(file.Name)}",
                                (file, appOutDir.Touch(file.Name)));
                        }
                    }
                }
            }
        }
    }
}