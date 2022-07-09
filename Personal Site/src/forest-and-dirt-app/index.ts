import { Pointer3DEvent } from "@juniper-lib/threejs/eventSystem/Pointer3DEvent";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { materialStandardToPhong } from "@juniper-lib/threejs/materials";
import { isMobile } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";
import { Dirt } from "../dirt-app/Dirt";
import { Forest } from "../forest-app/Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, materialStandardToPhong);
await env.load(...forest.assets);

const S = isMobile() ? 2048 : 4096;
const dirt = new Dirt(S, S, S / 8192);
const dirtMap = new THREE.Texture(dirt.element);
dirtMap.minFilter = THREE.LinearMipmapLinearFilter;
dirtMap.magFilter = THREE.LinearFilter;
dirtMap.needsUpdate = true;
dirt.addEventListener("update", () => dirtMap.needsUpdate = true);

const surface = forest.ground;
surface.material.precision = "highp";
surface.material.bumpMap = dirtMap;
surface.material.bumpScale = 0.1;
surface.material.needsUpdate = true;

const surfaceTarget = new RayTarget(surface);
surfaceTarget.addMesh(surface);
surfaceTarget.draggable = true;
surfaceTarget.addEventListener("down", checkPointer);
surfaceTarget.addEventListener("move", checkPointer);
surfaceTarget.addEventListener("up", checkPointer);

function checkPointer(evt: Pointer3DEvent) {
    dirt.checkPointerUV(
        evt.pointer.id,
        evt.hit.uv.x,
        1 - evt.hit.uv.y,
        evt.type);
}

await env.fadeIn();