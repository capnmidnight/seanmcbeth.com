using Juniper.TSBuild;

namespace SeanMcBeth
{
    public static class BuildConfig
    {
        public static readonly string ProjectName = "Personal Site";
        public static readonly BuildSystemOptions BuildSystemOptions = new()
        {
            Dependencies = new ()
            {
                { "Three.js", ("node_modules/three/build/three.js", "wwwroot/js/three/index.js") },
                { "Three.js min", ("node_modules/three/build/three.min.js", "wwwroot/js/three/index.min.js") },

                { "Cursor", ("../Juniper/etc/Assets/Models/Cursors/Cursors.glb", "wwwroot/models/Cursors.glb") }
            }
        };
    }
}