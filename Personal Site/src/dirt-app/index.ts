import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { EventSystemThreeJSEvent } from "@juniper-lib/threejs/eventSystem/EventSystemEvent";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env);
await forest.load();

const dirt = new Dirt(2048, 2048, 0.25);
const dirtMap = new THREE.Texture(dirt.element);
dirtMap.minFilter = THREE.LinearMipmapLinearFilter;
dirtMap.magFilter = THREE.LinearFilter;
dirtMap.needsUpdate = true;
dirt.addEventListener("update", () => dirtMap.needsUpdate = true);

const playable = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(forest.ground.result, obj => isMesh(obj) && obj.name === "Ground");
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