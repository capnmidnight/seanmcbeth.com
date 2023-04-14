import {
    DirectionalLight,
    Engine,
    HemisphericLight,
    MeshBuilder,
    PointerDragBehavior,
    Scene,
    SceneLoader,
    ShadowGenerator,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

import "@babylonjs/loaders";

import "./index.css";

(async function () {
    const canvas = document.querySelector<HTMLCanvasElement>("#frontBuffer");
    const engine = new Engine(canvas, true, { adaptToDeviceRatio: true });
    const scene = new Scene(engine);

    const resizer = new ResizeObserver(() => engine.resize());
    resizer.observe(canvas);

    const camera = new UniversalCamera("camera",
        new Vector3(0, 5, -10));
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const fillLight = new HemisphericLight("fillLight",
        new Vector3(0, 1, 0),
        scene);
    fillLight.intensity = 0.7;

    const keyLight = new DirectionalLight("keyLight",
        new Vector3(-10, -10, 7).normalize(),
        scene);
    keyLight.position.set(10, 10, -7);
    keyLight.intensity = 0.3;
    keyLight.shadowEnabled = true;

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1, segments: 32 });
    sphere.position.set(-3, 0.5, -1.5);

    const box = MeshBuilder.CreateBox("box", { width: 1, height: 1 });
    box.position.set(0, 0.5, 0);

    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
    ground.receiveShadows = true;

    const arrowResult = await SceneLoader.ImportMeshAsync("", "/models/", "Arrow.glb");
    const arrow = arrowResult.meshes[0];
    arrow.position.set(-2, 2, 2);
    arrow.lookAt(Vector3.Zero())

    const shadows = new ShadowGenerator(1024, keyLight);
    shadows.addShadowCaster(sphere);
    shadows.addShadowCaster(box);
    shadows.addShadowCaster(arrow);

    const dragSphereBehavior = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Up()
    });
    dragSphereBehavior.useObjectOrientationForDragging = false;
    dragSphereBehavior.updateDragPlane = false;
    dragSphereBehavior.attach(sphere);
    

    engine.runRenderLoop(() => scene.render());

    Object.assign(window, {
        canvas,
        engine,
        scene,
        camera,
        fillLight,
        keyLight,
        sphere,
        box,
        ground,
        arrowResult,
        arrow
    });
})().catch(exp => {
    console.error(exp);
});
