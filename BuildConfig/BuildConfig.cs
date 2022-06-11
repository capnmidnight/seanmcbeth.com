namespace SeanMcBeth
{
    public static class BuildConfig
    {
        public static readonly string ProjectName = "Personal Site";
        public static readonly Juniper.TSBuild.BuildSystemOptions BuildSystemOptions = new()
        {
            IncludeFetcher = true,
            IncludeEnvironment = true,
            IncludeThreeJS = true,
            SourceBuildJuniperTS = true,
        };
    }
}