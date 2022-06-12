import { Asset } from "@juniper-lib/fetcher";
import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { EventSystemThreeJSEvent } from "@juniper-lib/threejs/eventSystem/EventSystemEvent";
import { meshToInstancedMesh } from "@juniper-lib/threejs/meshToInstancedMesh";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan, IProgress, progressTasksWeighted, sleep } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";

const env = await createTestEnvironment();
await env.fadeOut();

const skybox = new Asset("/skyboxes/BearfenceMountain.jpeg", getJpeg);
const ground = new Asset("/models/Forest-Ground.glb", getModel);
const tree = new Asset("/models/Forest-Tree.glb", getModel);

await progressTasksWeighted(env.loadingBar, [
    [1, (prog) => env.load(prog)],
    [10, (prog) => env.fetcher.assets(prog, skybox, ground, tree)]
]);

env.skybox.setImage("dls", skybox.result);
env.foreground.add(ground.result);

await sleep(10); // this doesn't seem to work right if we don't give the renderer a beat
const matrices = makeTrees();
const treeMesh = objectScan<THREE.Mesh>(tree.result, (obj) => isMesh(obj));
const trees = meshToInstancedMesh(matrices.length, treeMesh);
for (let i = 0; i < matrices.length; ++i) {
    trees.setMatrixAt(i, matrices[i]);
}

env.foreground.add(trees);

const dirt = new Dirt(2048, 2048, 0.25);
const dirtMap = new THREE.Texture(dirt.element);
dirtMap.needsUpdate = true;
dirt.addEventListener("update", () => dirtMap.needsUpdate = true);

const playable = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(ground.result, obj => isMesh(obj) && obj.name === "Ground");
playable.material.bumpMap = dirtMap;
playable.material.bumpScale = 0.05;
playable.material.needsUpdate = true;
(playable as any).isCollider = true;
(playable as any).isDraggable = true;

const onDragEvt = (ev: THREE.Event) => checkPointer(ev as any as EventSystemThreeJSEvent<"drag">);
playable.addEventListener("drag", onDragEvt);
playable.addEventListener("dragcancel", onDragEvt);
playable.addEventListener("dragend", onDragEvt);
playable.addEventListener("dragstart", onDragEvt);

await env.fadeIn();

function checkPointer(evt: EventSystemThreeJSEvent<string>) {
    dirt.checkPointerUV(evt.pointer.name,
        evt.hit.uv.x,
        1 - evt.hit.uv.y,
        evt.type);
}

function getJpeg(path: string | URL, prog?: IProgress) {
    return env.fetcher
        .get(path)
        .useCache(false)
        .progress(prog)
        .image(Image_Jpeg)
        .then(response => response.content);
}

function getModel(path: string, prog?: IProgress) {
    return env.loadModel(path, prog);
}

function makeTrees() {
    const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
    raycaster.camera = env.camera;
    const tests = new Array<THREE.Intersection>();
    const matrices = new Array<THREE.Matrix4>();
    const q = new THREE.Quaternion();
    const right = new THREE.Vector3(1, 0, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(right, Math.PI / 2);
    const up = new THREE.Vector3(0, 1, 0);
    const s = new THREE.Vector3();
    for (let dz = -20; dz <= 20; ++dz) {
        for (let dx = -20; dx <= 20; ++dx) {
            if (Math.random() <= 0.1) {
                const x = Math.random() * 0.1 + dx;
                const z = Math.random() * 0.1 + dz;
                raycaster.ray.origin.set(x, 10, z);
                raycaster.ray.direction.set(0, -1, 0);
                raycaster.intersectObject(ground.result, true, tests);
                const groundHit = arrayScan(tests, (hit) => hit && hit.object && hit.object.name === "Ground");
                const waterHit = arrayScan(tests, (hit) => hit && hit.object && hit.object.name === "Water");
                arrayClear(tests);
                if (groundHit && !waterHit) {
                    const w = THREE.MathUtils.randFloat(0.6, 1.3);
                    const h = THREE.MathUtils.randFloat(0.6, 1.3);
                    s.set(w, h, w);
                    const a = THREE.MathUtils.randFloat(0, 2 * Math.PI);
                    const m = new THREE.Matrix4()
                        .compose(
                            groundHit.point,
                            q.setFromAxisAngle(up, a).multiply(q2),
                            s
                        );
                    matrices.push(m);
                }
            }
        }
    }
    return matrices;
}