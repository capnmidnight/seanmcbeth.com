using Juniper.TSBuild;

namespace SeanMcBeth
{
    public static class BuildConfig
    {
        public static readonly string ProjectName = "Personal Site";
        public static readonly BuildSystemOptions BuildSystemOptions;

        static BuildConfig()
        {
            BuildSystemOptions = new()
            {
                Dependencies = new()
                {
                    { "Three.js", ("node_modules/three/build/three.js", "wwwroot/js/three/index.js") },
                    { "Three.js min", ("node_modules/three/build/three.min.js", "wwwroot/js/three/index.min.js") },

                    { "Cursor", ("../Juniper/etc/Assets/Models/Cursors/Cursors.glb", "wwwroot/models/Cursors.glb") }
                }
            };

            var workingDir = new DirectoryInfo(".");
            var here = workingDir;
            while (here is not null && !here.CD(ProjectName, "src").Exists)
            {
                here = here.Parent;
            }

            if(here is not null)
            {
                here = here.CD(ProjectName, "src");

                foreach(var there in here.EnumerateDirectories())
                {
                    var desc = there.Touch("description.txt");
                    if (desc.Exists)
                    {
                        var source = PathExt.Abs2Rel(desc.FullName, workingDir.FullName);

                        BuildSystemOptions.Dependencies.Add(there.Name + " Description", (source, $"wwwroot/js/{there.Name}/description.txt"));
                    }
                }
            }
        }
    }
}