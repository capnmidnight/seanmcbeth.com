import { Application_Javascript } from "@juniper-lib/mediatypes";
import { cleanup } from "@juniper-lib/threejs/cleanup";
import { hasWebXR } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";
import Environment from "../environment";

const colors = [
    "red",
    "green",
    "blue",
    "yellow"
];

function rect(g: CanvasRenderingContext2D, color: string, x: number, y: number) {
    const { width, height } = g.canvas;
    const w = width / 2;
    const h = height / 2;
    g.fillStyle = color;
    g.fillRect(x * w, y * h, w, h);
}

const workerScript = `
const colors = [
  "red",
  "green",
  "blue",
  "yellow"
];

function rect(g, color, x, y) {
  const { width, height } = g.canvas;
  const w = width / 2;
  const h = height / 2;
  g.fillStyle = color;
  g.fillRect(x * w, y * h, w, h);
}

addEventListener("message", (evt) => {
  if (evt.data instanceof Array) {
    const canv = new OffscreenCanvas(evt.data[0], evt.data[1]);
    const g = canv.getContext("2d");
    const drawRect = (i2, x, y) => rect(g, colors[i2 % colors.length], x, y);
    const draw = (i2) => {
      drawRect(i2, 0, 0);
      drawRect(i2 + 1, 0, 1);
      drawRect(i2 + 2, 1, 0);
      drawRect(i2 + 3, 1, 1);
      const img = canv.transferToImageBitmap();
      postMessage(img, [img]);
    };
    let i = 0;
    draw(i);
    setInterval(() => draw(++i), 1000);
  }
});
`;

const workerScriptBlob = new Blob([workerScript], { type: Application_Javascript.value });
const workerScriptBlobUrl = URL.createObjectURL(workerScriptBlob);

(async function () {
    const env = await createTestEnvironment();
    await env.fadeOut();
    await env.load();

    env.arButton.visible = hasWebXR();

    // regular canvas
    const canvas1 = document.createElement("canvas");
    canvas1.width = 100;
    canvas1.height = 100;
    const map1 = makeMesh(env, canvas1, -1);
    map1.needsUpdate = true;
    const g1 = canvas1.getContext("2d");
    const drawRect = (i: number, x: number, y: number) => rect(g1, colors[i % colors.length], x, y);
    const draw = (i: number) => {
        drawRect(i, 0, 0);
        drawRect(i + 1, 0, 1);
        drawRect(i + 2, 1, 0);
        drawRect(i + 3, 1, 1);
    };
    let i = 0;
    draw(i);
    setInterval(() => {
        draw(++i);
        map1.needsUpdate = true;
    }, 1000);

    // offscreen canvas rendering in worker
    const map2 = makeMesh(env, null, 1);
    const worker = new Worker(workerScriptBlobUrl);
    worker.postMessage([100, 100]);
    worker.addEventListener("message", (evt) => {
        if (evt.data instanceof ImageBitmap) {
            cleanup(map2.image);
            map2.image = evt.data;
            map2.needsUpdate = true;
        }
    });

    await env.fadeIn();
})();

const geom = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
const uv = geom.getAttribute("uv") as THREE.Float32BufferAttribute;
for (let i = 0; i < uv.count; ++i) {
    uv.setY(i, 1 - uv.getY(i));
}

function makeMesh(env: Environment, canvas1: HTMLCanvasElement, x: number) {
    const map = new THREE.Texture(canvas1);
    const mat = new THREE.MeshBasicMaterial({ map });
    const mesh = new THREE.Mesh(geom, mat);

    map.flipY = false;
    env.foreground.add(mesh);
    mesh.position.set(x, 1.75, -3);

    return map;
}
