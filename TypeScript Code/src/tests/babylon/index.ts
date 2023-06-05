import {
    ActionManager,
    Animation,
    CircleEase,
    Color3,
    DirectionalLight,
    EasingFunction,
    Engine,
    HemisphericLight,
    MeshBuilder,
    PointerDragBehavior, Quaternion,
    Scene,
    SceneLoader,
    SetValueAction,
    ShadowGenerator,
    StandardMaterial,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";

import "@babylonjs/loaders";

import "./index.css";

const objectSize = 0.1;
const animationFrameRate = 30;
const animationLength = 0.25;
const animationFrames = animationLength * animationFrameRate;

const deltaA = new Vector3();
const deltaB = new Vector3();
function testSide(segA: Vector3, segB: Vector3, point: Vector3): number {
    deltaA.copyFrom(segA)
        .subtractInPlace(point);
    deltaB.copyFrom(segB)
        .subtractInPlace(point);
    return deltaA.x * deltaB.z - deltaB.x * deltaA.z;
}

function pointInTriangle(triA: Vector3, triB: Vector3, triC: Vector3, point: Vector3): boolean {
    const a = testSide(triA, triB, point);
    const b = testSide(triB, triC, point);
    const c = testSide(triC, triA, point);
    const allPos = Math.min(a, b, c) > 0;
    const allNeg = Math.max(a, b, c) < 0;
    return allPos || allNeg;
}

(async function () {
    const canvas = document.querySelector<HTMLCanvasElement>("#frontBuffer");
    const engine = new Engine(canvas, true, { adaptToDeviceRatio: true });
    const scene = new Scene(engine);

    const resizer = new ResizeObserver(() => engine.resize());
    resizer.observe(canvas);

    const camera = new UniversalCamera("camera",
        new Vector3(0, 1, -2));
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const fillLight = new HemisphericLight("fillLight",
        new Vector3(0, 1, 0),
        scene);
    fillLight.intensity = 0.7;

    const keyLight = new DirectionalLight("keyLight",
        new Vector3(-10, -10, 7).normalize(),
        scene);
    keyLight.position.set(5, 5, -7);
    keyLight.intensity = 0.3;
    keyLight.shadowEnabled = true;

    const activeMat = new StandardMaterial("activeMat");
    activeMat.diffuseColor = new Color3(0.25, 0.25, 1);

    const basicMat = new StandardMaterial("basicMat");
    basicMat.diffuseColor = new Color3(0.5, 0.5, 1);

    const inactiveMat = new StandardMaterial("inactiveMat");
    inactiveMat.diffuseColor = new Color3(0.75, 0.75, 1);

    const interiorMat = new StandardMaterial("interiorMat");
    interiorMat.diffuseColor = new Color3(0.5, 1, 0.5);

    const exteriorMat = new StandardMaterial("exteriorMat");
    exteriorMat.diffuseColor = new Color3(1, 1, 0.5);

    const sphere = MeshBuilder.CreateSphere("sphere", {
        diameter: objectSize,
        segments: 32
    });
    sphere.position.set(-0.5, 0.5 * objectSize, -0.5);
    sphere.material = basicMat;

    const box = MeshBuilder.CreateBox("box", {
        width: objectSize,
        height: objectSize,
        depth: objectSize
    });
    box.position.set(0, 0.5 * objectSize, 0);
    box.material = basicMat;

    const ground = MeshBuilder.CreateGround("ground", {
        width: 30 * objectSize,
        height: 30 * objectSize
    });
    ground.receiveShadows = true;

    const arrowResult = await SceneLoader.ImportMeshAsync("", "/models/", "Arrow.glb");
    const arrow = arrowResult.meshes[0];
    arrowResult.meshes[1].scaling.setAll(objectSize);
    arrow.position.set(0.5, 0.5 * objectSize, -0.5);
    arrow.lookAt(sphere.position);

    const shadows = new ShadowGenerator(1024, keyLight);
    shadows.bias = 0.000005;
    shadows.addShadowCaster(sphere);
    shadows.addShadowCaster(box);
    shadows.addShadowCaster(arrow);

    const lastSpherePosition = new Vector3();
    const spherePositionDelta = new Vector3();
    const arrowStartPosition = new Vector3();
    const arrowEndPosition = new Vector3();
    const arrowStartQuaternion = new Quaternion();

    const ease = new CircleEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    const arrowPosAnimation = new Animation("arrowPos",
        "position",
        animationFrameRate,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT);
    arrowPosAnimation.setEasingFunction(ease);

    const arrowQuatAnimation = new Animation("arrowQuat",
        "rotationQuaternion",
        animationFrameRate,
        Animation.ANIMATIONTYPE_QUATERNION,
        Animation.ANIMATIONLOOPMODE_CONSTANT);

    arrow.animations.push(arrowPosAnimation, arrowQuatAnimation);

    const dragSphereBehavior = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Up()
    });
    dragSphereBehavior.useObjectOrientationForDragging = false;
    dragSphereBehavior.updateDragPlane = false;
    dragSphereBehavior.dragDeltaRatio = 1;
    dragSphereBehavior.attach(sphere);

    dragSphereBehavior.onDragStartObservable.add(() =>
        lastSpherePosition.copyFrom(sphere.position));

    dragSphereBehavior.onDragEndObservable.add(() => {
        arrowStartPosition.copyFrom(arrow.position);
        arrowStartQuaternion.copyFrom(arrow.rotationQuaternion);

        spherePositionDelta
            .copyFrom(sphere.position)
            .subtractInPlace(lastSpherePosition);

        const len = spherePositionDelta.length(); 1;
        if (len > 0) {
            spherePositionDelta.normalizeFromLength(len);

            const arrowEndQuaternion = Quaternion.FromLookDirectionLH(spherePositionDelta, Vector3.Up());

            arrowEndPosition
                .copyFrom(spherePositionDelta)
                .scaleInPlace(0.5)
                .addInPlace(sphere.position);

            arrowPosAnimation.setKeys([
                { frame: 0, value: arrowStartPosition },
                { frame: animationFrames, value: arrowEndPosition }
            ]);

            arrowQuatAnimation.setKeys([
                { frame: 0, value: arrowStartQuaternion },
                { frame: animationFrames, value: arrowEndQuaternion }
            ]);

            const mat = pointInTriangle(lastSpherePosition, arrowStartPosition, arrowEndPosition, box.position)
                ? interiorMat
                : exteriorMat;

            scene.beginAnimation(arrow, 0, animationFrames)
                .waitAsync()
                .then(() => box.material = mat);
        }
    });

    box.actionManager = new ActionManager();
    box.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOverTrigger },
        box,
        "material",
        inactiveMat
    ));

    box.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOutTrigger },
        box,
        "material",
        basicMat
    ));

    sphere.actionManager = new ActionManager();
    sphere.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOverTrigger },
        sphere,
        "material",
        activeMat
    ));

    sphere.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOverTrigger },
        sphere,
        "scaling",
        new Vector3(1.1, 1.1, 1.1)
    ));

    sphere.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOutTrigger },
        sphere,
        "material",
        basicMat
    ));

    sphere.actionManager.registerAction(new SetValueAction(
        { trigger: ActionManager.OnPointerOutTrigger },
        sphere,
        "scaling",
        new Vector3(1, 1, 1)
    ));

    engine.runRenderLoop(() => scene.render());

})().catch(exp => {
    console.error(exp);
});
