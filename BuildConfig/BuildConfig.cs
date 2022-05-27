namespace SeanMcBeth
{
    public static class BuildConfig
    {
        public static string ProjectName = "Personal Site";
        public static Juniper.TSBuild.BuildSystemOptions BuildSystemOptions = new()
        {
            IncludeFetcher = true,
            IncludeEnvironment = true,
            IncludePDFJS = true,
            IncludeThreeJS = true,
            SourceBuildJuniperTS = true
        };
    }
}