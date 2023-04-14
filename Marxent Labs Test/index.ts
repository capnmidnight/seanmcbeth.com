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
    const engine = new Engine(canvas, true, { adaptToDeviceRatio: true });
    const scene = new Scene(engine);

    const resizer = new ResizeObserver(() => engine.resize());
    resizer.observe(canvas);

    const camera = new UniversalCamera("camera",
        new Vector3(0, 5, -10));
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light",
        new Vector3(0, 1, 0),
        scene);
    light.intensity = 0.7;

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1, segments: 32 });
    sphere.position.set(-3, 0.5, -1.5);

    const box = MeshBuilder.CreateBox("box", { width: 1, height: 1 });
    box.position.set(0, 0.5, 0);

    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 });

    engine.runRenderLoop(() => scene.render());

    Object.assign(window, {
        canvas,
        engine,
        scene,
        camera,
        light,
        sphere,
        box,
        ground
    });
}
catch (exp) {
    console.error(exp);
}
