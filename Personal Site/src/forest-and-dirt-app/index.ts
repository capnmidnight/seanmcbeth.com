import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { Pointer3DEvent } from "@juniper-lib/threejs/eventSystem/Pointer3DEvent";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { createTestEnvironment } from "../createTestEnvironment";
import { Dirt } from "../dirt-app/Dirt";
import { Forest } from "../forest-app/Forest";

const S = 1024;

const env = await createTestEnvironment();
await env.fadeOut();

const dirtMapAsset = new AssetImage("/img/dirt.jpg", Image_Jpeg, !DEBUG);

const forest = new Forest(env);
await env.load(dirtMapAsset, ...forest.assets);

const dirtMapTex = new THREE.Texture(dirtMapAsset.result);
dirtMapTex.minFilter = THREE.LinearMipmapLinearFilter;
dirtMapTex.magFilter = THREE.LinearFilter;
dirtMapTex.needsUpdate = true;

const dirtBumpMap = new Dirt(S, S, 2);
const dirtBumpMapTex = new THREE.Texture(dirtBumpMap.element);
dirtBumpMapTex.minFilter = THREE.LinearMipmapLinearFilter;
dirtBumpMapTex.magFilter = THREE.LinearFilter;
dirtBumpMapTex.needsUpdate = true;
dirtBumpMap.addEventListener("update", () => dirtBumpMapTex.needsUpdate = true);

const dirtGeom = new THREE.BoxBufferGeometry(1, 0.02, 1, 1, 1, 1);

const dirtMat = new THREE.MeshPhongMaterial({
    precision: "highp",
    map: dirtMapTex,
    bumpMap: dirtBumpMapTex,
    bumpScale: 0.01,
    shininess: 0,
    flatShading: false,
    reflectivity: 0
});

const dirt = new THREE.Mesh(dirtGeom, dirtMat);
dirt.position.set(0, 0, -1);

const dirtTarget = new RayTarget(dirt);
dirtTarget.addMesh(dirt);
dirtTarget.draggable = true;
dirtTarget.addEventListener("down", checkPointer);
dirtTarget.addEventListener("move", checkPointer);
dirtTarget.addEventListener("up", checkPointer);

Object.assign(window, { dirt });

forest.ground.attach(dirt);

await env.fadeIn();



function checkPointer(evt: Pointer3DEvent) {
    dirtBumpMap.checkPointerUV(
        evt.pointer.id,
        evt.hit.uv.x,
        1 - evt.hit.uv.y,
        evt.type);
}
