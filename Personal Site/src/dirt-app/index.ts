import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { EventSystemThreeJSEvent } from "@juniper-lib/threejs/eventSystem/EventSystemEvent";
import { isMobile } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env);
await forest.load();

const S = isMobile() ? 2048 : 4096;
const dirt = new Dirt(S, S, S / 8192);
const dirtMap = new THREE.Texture(dirt.element);
dirtMap.minFilter = THREE.LinearMipmapLinearFilter;
dirtMap.magFilter = THREE.LinearFilter;
dirtMap.needsUpdate = true;
dirt.addEventListener("update", () => dirtMap.needsUpdate = true);

const surface = forest.ground;
surface.material.precision = "highp";
//surface.material.bumpMap = dirtMap;
//surface.material.bumpScale = 0.1;
surface.material.needsUpdate = true;
surface.isClickable = true;
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