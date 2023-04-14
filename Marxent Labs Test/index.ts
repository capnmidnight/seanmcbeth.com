import {
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

import "./index.css";

try {
    const canvas = document.querySelector<HTMLCanvasElement>("#frontBuffer");
    // Creates a basic Babylon Scene object
    const engine = new Engine(canvas, true, {
        adaptToDeviceRatio: true,
        antialias: true,
    }, true);

    const resizer = new ResizeObserver(() =>
        engine.resize());

    resizer.observe(canvas);
    const scene = new Scene(engine);

    const camera = new UniversalCamera("camera1",
        new Vector3(0, 5, -10),
        scene);

    camera.setTarget(Vector3.Zero());
    // Attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Creates a light, aiming 0,1,0
    const light = new HemisphericLight("light",
        new Vector3(0, 1, 0),
        scene);
    // Dim the light a small amount 0 - 1
    light.intensity = 0.7;

    const sphere = MeshBuilder.CreateSphere("sphere",
        { diameter: 2, segments: 32 },
        scene);
    // Move sphere upward 1/2 its height
    sphere.position.y = 1;

    const ground = MeshBuilder.CreateGround("ground",
        { width: 6, height: 6 },
        scene);


    engine.runRenderLoop(() =>
        scene.render());
}
catch (exp) {
    console.error(exp);
}
