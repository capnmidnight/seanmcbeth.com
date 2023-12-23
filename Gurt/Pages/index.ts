import { ID } from "@juniper-lib/dom/src/attrs";
import { Canvas } from "@juniper-lib/dom/src/tags";
import { Ball } from "./Ball";
import { debounce } from "@juniper-lib/events/src/debounce";

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