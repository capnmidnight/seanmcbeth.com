import { Application_Javascript } from "@juniper-lib/mediatypes";
import { createTestEnvironment } from "../createTestEnvironment";
import Environment from "../environment";
import { isDebug } from "../isDebug";

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
  if (evt.data instanceof OffscreenCanvas) {
    const g = evt.data.getContext("2d");
    const drawRect = (i2, x, y) => rect(g, colors[i2 % colors.length], x, y);
    const draw = (i2) => {
      drawRect(i2, 0, 0);
      drawRect(i2 + 1, 0, 1);
      drawRect(i2 + 2, 1, 0);
      drawRect(i2 + 3, 1, 1);
      postMessage("update");
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
    const env = await createTestEnvironment(isDebug);
    await env.fadeOut();
    await env.load();

    // regular canvas
    const canvas1 = document.createElement("canvas");
    canvas1.width = 100;
    canvas1.height = 100;
    const map2 = makeMesh(env, canvas1, -1);
    const g = canvas1.getContext("2d");
    const drawRect = (i: number, x: number, y: number) => rect(g, colors[i % colors.length], x, y);
    const draw = (i: number) => {
        drawRect(i, 0, 0);
        drawRect(i + 1, 0, 1);
        drawRect(i + 2, 1, 0);
        drawRect(i + 3, 1, 1);
        postMessage("update");
    };
    let i = 0;
    draw(i);
    setInterval(() => {
        draw(++i);
        map2.needsUpdate = true;
    }, 1000);

    // offscreen canvas rendering in worker
    const canvas2 = document.createElement("canvas");
    canvas2.width = 100;
    canvas2.height = 100;
    const map1 = makeMesh(env, canvas2, 1);
    const worker = new Worker(workerScriptBlobUrl);
    const offscreen = canvas2.transferControlToOffscreen();
    worker.postMessage(offscreen, [offscreen]);
    worker.addEventListener("message", (evt) => {
        if (evt.data === "update") {
            map1.needsUpdate = true;
        }
    });

    await env.fadeIn();
})();

function makeMesh(env: Environment, canvas1: HTMLCanvasElement, x: number) {
    const geom = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const map = new THREE.CanvasTexture(canvas1);
    const mat = new THREE.MeshBasicMaterial({ map });
    const mesh = new THREE.Mesh(geom, mat);

    env.foreground.add(mesh);

    mesh.position.set(x, 1.75, -3);
    return map;
}
