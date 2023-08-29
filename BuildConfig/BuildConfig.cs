using Juniper.TSBuild;

namespace SeanMcBeth
{
    public class BuildConfig : IBuildConfig
    {
        private const string ServerProjectName = "seanmcbeth.com";
        private const string ScriptProjectName = "TypeScript Code";

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
            var here = workingDir;
            while (here is not null && !here.CD(ScriptProjectName, "src").Exists)
            {
                here = here.Parent;
            }

            if (here is null)
            {
                throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);
            }

            var juniperDir = here.CD("Juniper");
            var projectInDir = here.CD(ScriptProjectName);
            var projectOutDir = here.CD(ServerProjectName);
            var nodeModules = projectInDir.CD("node_modules");
            var jsInput = projectInDir.CD("src");
            var wwwRoot = projectOutDir.CD("wwwroot");
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
                InProjectName = ScriptProjectName,
                OutProjectName = ServerProjectName,
                Deployment = new DeploymentOptions(
                    "seanmcbeth.com",
                    "smcbeth",
                    keyFile,
                    "SeanMcBeth.Site"),
                BannedDependencies = new[]
                {
                    ("pdfjs-dist", "2.15.349", "Internal KeyboardManager does not work on old Oculus for Business Quest 2s. Use 2.14.305 instead.")
                },
                Dependencies = new()
                {
                    { "Cursor", (pathHelper.CursorModel, modelOutput.Touch("Cursors.glb")) },
                    { "Watch", (pathHelper.WatchModel, modelOutput.Touch("watch1.glb")) },

                    { "Forest Ground", (pathHelper.ForestGroundModel, modelOutput.Touch("Forest-Ground.glb")) },
                    { "Forest Tree", (pathHelper.ForestTreeModel, modelOutput.Touch("Forest-Tree.glb")) },

                    { "Forest Audio", (pathHelper.ForestAudio,  audioOutput.Touch("forest.mp3")) },
                    { "Test Audio", (pathHelper.StarTrekComputerBeep55Audio,  audioOutput.Touch("test-clip.mp3")) },
                    { "Footsteps", (pathHelper.FootStepsAudio,  audioOutput.Touch("footsteps.mp3")) },
                    { "Button Press", (pathHelper.ButtonPressAudio,  audioOutput.Touch("vintage_radio_button_pressed.mp3")) },
                    { "Door Open", (pathHelper.DoorOpenAudio,  audioOutput.Touch("door_open.mp3")) },
                    { "Door Close", (pathHelper.DoorCloseAudio,  audioOutput.Touch("door_close.mp3")) },
                    { "UI Dragged", (pathHelper.UIDraggedAudio,  audioOutput.Touch("basic_dragged.mp3")) },
                    { "UI Enter", (pathHelper.UIEnterAudio,  audioOutput.Touch("basic_enter.mp3")) },
                    { "UI Error", (pathHelper.UIErrorAudio,  audioOutput.Touch("basic_error.mp3")) },
                    { "UI Exit", (pathHelper.UIExitAudio,  audioOutput.Touch("basic_exit.mp3")) }
                }
            };

            pathHelper.AddUITextures(Options, uiImgOUtput);

            CopyMetaFiles("apps", jsInput, jsOutput, Options);
            CopyMetaFiles("tests", jsInput, jsOutput, Options);
        }

        public BuildSystemOptions Options { get; }

        private static void CopyMetaFiles(string subName, DirectoryInfo jsInput, DirectoryInfo jsOutput, BuildSystemOptions options)
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
                            options.OptionalDependencies.Add(
                                    $"{appInDir.Name} {Path.GetFileNameWithoutExtension(file.Name)}",
                                    (file, appOutDir.Touch(file.Name)));
                        }
                    }
                }
            }
        }
    }
}