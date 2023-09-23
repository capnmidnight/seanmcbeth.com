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
            CleanDirs = new[]
            {
                jsOutput
            },
            InProject = here,
            OutProject = here,
            BannedDependencies = new[]
            {
                ("pdfjs-dist", "2.15.349", "Internal KeyboardManager does not work on old Oculus for Business Quest 2s. Use 2.14.305 instead.")
            },
            Dependencies = new List<BuildSystemDependency>()
                {
                    pathHelper.PDFJSWorkerBundle.MakeDependency(pdfJsOut),
                    pathHelper.PDFJSWorkerMap.MakeDependency(pdfJsOut),
                    pathHelper.PDFJSWorkerMinBundle.MakeDependency(pdfJsOut),

                    pathHelper.JQueryBundle.MakeDependency(jQueryOut),
                    pathHelper.JQueryMinBundle.MakeDependency(jQueryOut),

                    pathHelper.CursorModel.MakeDependency(modelOutput),
                    pathHelper.WatchModel.MakeDependency(modelOutput),

                    pathHelper.StarTrekComputerBeep55Audio.MakeDependency(audioOutput.Touch("test-clip.mp3")),
                    pathHelper.FootStepsAudio.MakeDependency(audioOutput.Touch("footsteps.mp3")),
                    pathHelper.ButtonPressAudio.MakeDependency(audioOutput),
                    pathHelper.DoorOpenAudio.MakeDependency(audioOutput),
                    pathHelper.DoorCloseAudio.MakeDependency(audioOutput),
                    pathHelper.UIDraggedAudio.MakeDependency(audioOutput),
                    pathHelper.UIEnterAudio.MakeDependency(audioOutput),
                    pathHelper.UIErrorAudio.MakeDependency(audioOutput),
                    pathHelper.UIExitAudio.MakeDependency(audioOutput)
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
                        yield return file.MakeDependency(appOutDir);
                    }
                }
            }
        }
    }
}