using Juniper.TSBuild;

namespace Yarrow;

public class BuildConfig : IBuildConfig
{
    private const string ProjectName = "Yarrow";

    private static readonly string[] FilePatterns =
    {
        "*.bool"
    };

    public BuildSystemOptions Options { get; }

    public BuildConfig()
    {
        var workingDir = new DirectoryInfo(".");
        var here = workingDir.GoUpUntil(here => here.CD(ProjectName).Touch("package.json").Exists)
            ?? throw new DirectoryNotFoundException("Could not find project root from " + workingDir.FullName);
        here = here.CD(ProjectName);

        var juniperDir = here.CD("..", "..", "Juniper");
        var nodeModules = here.CD("node_modules");
        var jsInput = here.CD("src");
        var wwwRoot = here.CD("wwwroot");
        var jsOutput = wwwRoot.CD("js");
        var modelOutput = wwwRoot.CD("models");
        var audioOutput = wwwRoot.CD("audio");
        var imgOutput = wwwRoot.CD("images");
        var jQueryOut = jsOutput.CD("jquery");
        var pdfJsOut = jsOutput.CD("pdfjs");
        var uiImgOutput = imgOutput.CD("ui");

        var pathHelper = new PathHelper(juniperDir, nodeModules);

        Options = new BuildSystemOptions()
        {
            Project = here,
            CleanDirs = new[]
            {
                jsOutput
            },
            SkipPreBuild = true,
            BannedDependencies = new[]
            {
                ("pdfjs-dist", "2.15.349", "Internal KeyboardManager does not work on old Oculus for Business Quest 2s. Use 2.14.305 instead.")
            },
            Dependencies = new List<BuildSystemDependency>()
                {
                    pathHelper.PDFJSWorkerBundle.CopyTo(pdfJsOut),
                    pathHelper.PDFJSWorkerMap.CopyTo(pdfJsOut),
                    pathHelper.PDFJSWorkerMinBundle.CopyTo(pdfJsOut),

                    pathHelper.JQueryBundle.CopyTo(jQueryOut),
                    pathHelper.JQueryMinBundle.CopyTo(jQueryOut),

                    pathHelper.CursorModel.CopyTo(modelOutput),
                    pathHelper.WatchModel.CopyTo(modelOutput),

                    pathHelper.StarTrekComputerBeep55Audio.CopyAs(audioOutput.Touch("test-clip.mp3")),
                    pathHelper.FootStepsAudio.CopyAs(audioOutput.Touch("footsteps.mp3")),
                    pathHelper.ButtonPressAudio.CopyTo(audioOutput),
                    pathHelper.DoorOpenAudio.CopyTo(audioOutput),
                    pathHelper.DoorCloseAudio.CopyTo(audioOutput),
                    pathHelper.UIDraggedAudio.CopyTo(audioOutput),
                    pathHelper.UIEnterAudio.CopyTo(audioOutput),
                    pathHelper.UIErrorAudio.CopyTo(audioOutput),
                    pathHelper.UIExitAudio.CopyTo(audioOutput)
                },
            OptionalDependencies = CopyMetaFiles("dom-apps", jsInput, jsOutput)
                .Union(CopyMetaFiles("tests", jsInput, jsOutput))
                .Union(CopyMetaFiles("vr-apps", jsInput, jsOutput))
        };

        pathHelper.AddUITextures(Options, uiImgOutput);        
    }

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