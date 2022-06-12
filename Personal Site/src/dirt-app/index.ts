import { isModifierless, onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerMove, onPointerOut, onPointerOver, onPointerUp } from "@juniper-lib/dom/evts";
import { elementApply } from "@juniper-lib/dom/tags";
import { Dirt } from "@juniper-lib/graphics2d/Dirt";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
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
quad.position.set(0, 1.5, -2);
env.foreground.add(quad);

await env.fadeIn();

dirt.addEventListener("update", () => bumpMap.needsUpdate = true);
elementApply(
    document.body,
    onPointerMove(checkPointer),
    onPointerDown(checkPointer),
    onPointerCancel(checkPointer),
    onPointerUp(checkPointer),
    onPointerLeave(checkPointer),
    onPointerEnter(checkPointer),
    onPointerOut(checkPointer),
    onPointerOver(checkPointer)
);

env.timer.addTickHandler((evt) => {
    quad.rotation.y += evt.dt / 5000;
})

function checkPointer(evt: PointerEvent) {
    if (!isModifierless(evt)) {
        dirt.stop();
    }
    else {
        let type = evt.type;
        if (type === "pointerenter"
            && evt.pointerType === "mouse"
            && evt.buttons === 1) {
            type = "pointerdown";
        }
        dirt.checkPointerUV(evt.pointerId,
            evt.offsetX / document.body.clientWidth,
            evt.offsetY / document.body.clientHeight,
            type);
    }
}