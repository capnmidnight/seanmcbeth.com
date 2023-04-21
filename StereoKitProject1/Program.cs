using StereoKit;

using System;

namespace StereoKitProject1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Initialize StereoKit
            var settings = new SKSettings()
            {
                appName = "StereoKitProject1",
                assetsFolder = "Assets",
            };

            if (!SK.Initialize(settings))
            {
                Environment.Exit(1);
            }


            // Create assets used by the app
            var cubePose = new Pose(0, 0, -0.5f, Quat.Identity);
            var cube = Model.FromMesh(
                Mesh.GenerateRoundedCube(Vec3.One * 0.1f, 0.02f),
                Default.MaterialUI);

            var floorTransform = Matrix.TS(0, -1.5f, 0, new Vec3(30, 0.1f, 30));
            var floorMaterial = new Material(Shader.FromFile("floor.hlsl"))
            {
                Transparency = Transparency.Blend
            };


            // Core application loop
            while (SK.Step(() =>
            {
                if (SK.System.displayType == Display.Opaque)
                {
                    Default.MeshCube.Draw(floorMaterial, floorTransform);
                }

                UI.Handle("Cube", ref cubePose, cube.Bounds);
                cube.Draw(cubePose.ToMatrix());
            }))
            {
                // nothing
            }

            SK.Shutdown();
        }
    }
}
