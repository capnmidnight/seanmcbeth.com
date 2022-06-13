import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { EventSystemThreeJSEvent } from "@juniper-lib/threejs/eventSystem/EventSystemEvent";
import { InteractiveObject3D } from "@juniper-lib/threejs/eventSystem/InteractiveObject3D";
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

const surface = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & InteractiveObject3D>(forest.ground, obj => isMesh(obj) && obj.name === "Ground");
surface.material.precision = "highp";
surface.material.bumpMap = dirtMap;
surface.material.bumpScale = 0.1;
surface.material.needsUpdate = true;
surface.isDraggable = true;

const onDragEvt = (ev: THREE.Event) => checkPointer(ev as any as EventSystemThreeJSEvent<"drag">);
surface.addEventListener("drag", onDragEvt);
surface.addEventListener("dragcancel", onDragEvt);
surface.addEventListener("dragend", onDragEvt);
surface.addEventListener("dragstart", onDragEvt);

await env.fadeIn();

function checkPointer(evt: EventSystemThreeJSEvent<string>) {
    dirt.checkPointerUV(evt.pointer.name,
        evt.hit.uv.x,
        1 - evt.hit.uv.y,
        evt.type);
}