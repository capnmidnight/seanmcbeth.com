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
        var workingDir = BuildSystemOptions.FindSolutionRoot(ProjectName);
        var here = workingDir.CD(ProjectName);
        var juniperDir = here.CD("..", "..", "Juniper");
        var nodeModules = here.CD("node_modules");
        var jsInput = here.CD("src");
        var wwwRoot = here.CD("wwwroot");
        var jsOutput = wwwRoot.CD("js");
        var modelOutput = wwwRoot.CD("models");
        var audioOutput = wwwRoot.CD("audio");
        var imgOutput = wwwRoot.CD("images");
        var pdfJsOut = jsOutput.CD("pdfjs");
        var uiImgOutput = imgOutput.CD("ui");

        var pathHelper = new JuniperAssetHelper(juniperDir);

        Options = new BuildSystemOptions()
        {
            Project = here,
            CleanDirs = [jsOutput],
            Dependencies = [
                ..pathHelper.JS.PDFJS.CopyFiles(pdfJsOut),

                pathHelper.Models.Cursors.CopyFile(modelOutput),
                pathHelper.Models.Watch.CopyFile(modelOutput),

                pathHelper.Audios.StarTrek.ComputerBeep55.CopyFile(audioOutput.Touch("test-clip.mp3")),
                pathHelper.Audios.FootStepsFast.CopyFile(audioOutput.Touch("footsteps.mp3")),
                pathHelper.Audios.ButtonPress.CopyFile(audioOutput),
                pathHelper.Audios.DoorOpen.CopyFile(audioOutput),
                pathHelper.Audios.DoorClose.CopyFile(audioOutput),
                pathHelper.Audios.UIDragged.CopyFile(audioOutput),
                pathHelper.Audios.UIEnter.CopyFile(audioOutput),
                pathHelper.Audios.UIError.CopyFile(audioOutput),
                pathHelper.Audios.UIExit.CopyFile(audioOutput)
            ],
            OptionalDependencies = [
                ..CopyMetaFiles("dom-apps", jsInput, jsOutput),
                ..CopyMetaFiles("tests", jsInput, jsOutput),
                ..CopyMetaFiles("vr-apps", jsInput, jsOutput)
            ]
        };

        pathHelper.Textures.AddUITextures(Options, uiImgOutput);
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
                        yield return file.CopyFile(appOutDir);
                    }
                }
            }
        }
    }
}