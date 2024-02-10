import { ID } from "@juniper-lib/dom/src/attrs";
import { Canvas } from "@juniper-lib/dom/src/tags";
import { Ball } from "./Ball";
import { debounce } from "@juniper-lib/events/src/debounce";
import "./index.css";

const canvas = Canvas(ID("frontBuffer"));
const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
const resize = debounce(_resize);
const resizer = new ResizeObserver((evts) => {
    for(const evt of evts){ 
        if(evt.target === canvas) {
            resize();
        }
    }
});


const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
const device = await adapter.requestDevice();

const balls = new Array<Ball>(100);
const srcArrayBuffer = Ball.fill(balls);
const srcDataBuffer = new Uint8Array(srcArrayBuffer);
const gpuBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: srcArrayBuffer.byteLength,
    usage: GPUBufferUsage.MAP_WRITE
});
const gpuArrayBuffer = gpuBuffer.getMappedRange();
const gpuDataBuffer = new Uint8Array(gpuArrayBuffer);
gpuDataBuffer.set(srcDataBuffer);

resizer.observe(canvas);

function _resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
}

requestAnimationFrame(draw);
function draw() {
    requestAnimationFrame(draw);
    const s = Math.min(canvas.width, canvas.height);
    const sh = s / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(0.01, 0.01);
    for(const ball of balls) {
        ball.draw2d(context, s, sh);
    }
    context.restore();
}

requestAnimationFrame(update);
async function update() {
    requestAnimationFrame(update);
}