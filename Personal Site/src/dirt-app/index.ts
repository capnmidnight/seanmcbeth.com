import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { EventSystemThreeJSEvent } from "@juniper-lib/threejs/eventSystem/EventSystemEvent";
import { lit } from "@juniper-lib/threejs/materials";
import { Plane } from "@juniper-lib/threejs/Plane";
import { createTestEnvironment } from "../createTestEnvironment";

const env = await createTestEnvironment();
await env.fadeOut();

const [sky, img] = (await Promise.all([
    "/img/dls-waiting-area-cube.jpg",
    "/img/2021-03.min.jpg"
].map((src) => env.fetcher
    .get(src)
    .image(Image_Jpeg))))
    .map((response) => response.content);

env.skybox.setImage("dls", sky);

const map = new THREE.Texture(img);
map.needsUpdate = true;

const dirt = new Dirt(1024, 1024);
const bumpMap = new THREE.Texture(dirt.element);
bumpMap.needsUpdate = true;
dirt.addEventListener("update", () => bumpMap.needsUpdate = true);

const mat = lit({
    map,
    bumpMap,
    bumpScale: 0.05,
    side: THREE.DoubleSide
});
mat.needsUpdate = true;

const quad = new Plane(1, 1, mat);
quad.isCollider = true;
quad.isDraggable = true;
quad.position.set(0, 1.5, -2);
env.foreground.add(quad);

const onDragEvt = (ev: THREE.Event) => checkPointer(ev as any as EventSystemThreeJSEvent<"drag">);
quad.addEventListener("drag", onDragEvt);
quad.addEventListener("dragcancel", onDragEvt);
quad.addEventListener("dragend", onDragEvt);
quad.addEventListener("dragstart", onDragEvt);

await env.fadeIn();

//env.timer.addTickHandler((evt) => {
//    quad.rotation.y += evt.dt / 5000;
//});

type DragEvents = "drag"
    | "dragcancel"
    | "dragend"
    | "dragstart";

function checkPointer(evt: EventSystemThreeJSEvent<DragEvents>) {
    dirt.checkPointerUV(evt.pointer.name,
        evt.hit.uv.x,
        1 - evt.hit.uv.y,
        evt.type);
}