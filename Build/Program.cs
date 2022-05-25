await Juniper.TSBuild.BuildSystem.Run("Personal Site", new Juniper.TSBuild.BuildSystemOptions
{
    IncludeFetcher = true,
    IncludEnvironment = true,
    IncludePDFJS = true,
    IncludeThreeJS = true
}, args);