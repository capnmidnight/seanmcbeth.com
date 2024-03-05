
// reference: https://gpuweb.github.io/gpuweb/

import { Exception } from "@juniper-lib/tslib/dist/Exception";
import { createFetcher } from "../../createFetcher";
import { AssetWgslShader } from "./WgslShader";
import { Canvas, H1 } from "@juniper-lib/dom/dist/tags";
import { ID, Query } from "@juniper-lib/dom/dist/attrs";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks"
import { Ball } from "./Ball";
import { debounce } from "@juniper-lib/events/dist/debounce";
import { RingBuffer } from "@juniper-lib/collections/dist/RingBuffer";
import { RequestAnimationFrameTimer } from "@juniper-lib/timers/dist/RequestAnimationFrameTimer";
import { SetIntervalTimer } from "@juniper-lib/timers/dist/SetIntervalTimer";
import { TimerTickEvent } from "@juniper-lib/timers/dist/ITimer";
import "./index.css";


const titleElement = H1(Query("main > h1"));
const title = titleElement.innerText;
const fetcher = createFetcher();
const shaderAsset = new AssetWgslShader("/js/tests/webgpu/index.wgsl");
await fetcher.assets(shaderAsset);
const shader = shaderAsset.result;
if (!shader.entryPoints.has("compute")) {
    throw new Exception("No compute shader found:\n" + shader.code)
}
const NUM_BALLS = shader.constants.get("NUM_BALLS");
const WORK_GROUP_SIZE = shader.constants.get("WORK_GROUP_SIZE");

const adapter = await navigator.gpu.requestAdapter();
const requiredFeatures = [feat("timestamp-query")].filter(isDefined);
console.log(adapter);

const device = await adapter.requestDevice({ requiredFeatures });

const { balls, ballData: ballDataCPU, connectionData: connectionDataCPU } = Ball.create(NUM_BALLS);

const ballDataGPUIn = device.createBuffer({
    label: "ballDataGPUIn",
    size: ballDataCPU.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});

const ballDataGPUOut = device.createBuffer({
    label: "ballDataGPUOut",
    size: ballDataCPU.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
});

const ballDataGPUReadable = device.createBuffer({
    label: "ballDataGPUReadable",
    size: ballDataCPU.byteLength,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
});

const connectionDataGPUIn = device.createBuffer({
    label: "connectionDataGPU",
    size: connectionDataCPU.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});

const uniformsBuffer = new Float32Array(1);
const DT = 0;
const uniformsBufferIn = device.createBuffer({
    label: "uniformsBuffer",
    size: uniformsBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
});


const updateShader = device.createShaderModule({
    label: "Compute Shader",
    code: shader.code
});

const info = await updateShader.getCompilationInfo();
console.log(...info.messages);

const computePipeline = await device.createComputePipelineAsync({
    label: "computePipline",
    layout: "auto",
    compute: {
        module: updateShader,
        entryPoint: shader.entryPoints.get("compute")
    }
});

function createGroups(...entrieses: { label: string, buffer: GPUBuffer }[][]) {
    return entrieses.map((entries, group) => device.createBindGroup({
        label: `Group ${group}`,
        layout: computePipeline.getBindGroupLayout(group),
        entries: entries.map((entry, binding) => ({
            binding,
            resource: {
                label: entry.label,
                buffer: entry.buffer,
                offset: 0,
                size: entry.buffer.size
            }
        }))
    }));
}

const bindGroups = createGroups([{
    label: "ballsIn",
    buffer: ballDataGPUIn
}, {
    label: "connections",
    buffer: connectionDataGPUIn
}, {
    label: "ballsOut",
    buffer: ballDataGPUOut
}], [{
    label: "uniforms",
    buffer: uniformsBufferIn
}]);

const canvas = Canvas(ID("frontBuffer"));
const g = canvas.getContext("2d");
const resize = debounce(_resize);
const updateTimings = new RingBuffer<number>(10);
const renderTimings = new RingBuffer<number>(10);
const renderTimer = new RequestAnimationFrameTimer();
const infoTimer = new SetIntervalTimer(1);
let width: number;
let height: number;
let invWidth: number;
let invHeight: number;

const resizer = new ResizeObserver((evts) => {
    for(const evt of evts) { 
        if(evt.target === canvas) {
            resize();
        }
    }
});

infoTimer.addTickHandler(() => {
    if(renderTimings.length === 10 && updateTimings.length === 10) {
        const fr = renderTimings.reduce((a, b) => a + b / 10, 0);
        const rps = 1 / fr;
        const ur = updateTimings.reduce((a, b) => a + b / 10, 0);
        const ups = 1 / ur;
        titleElement.innerText = `${title} - ${rps.toFixed(0)}/${ups.toFixed(0)}`;
    }
});

resize();
resizer.observe(canvas);

animateAsync(update);
renderTimer.addTickHandler(render);
infoTimer.start();
renderTimer.start();

device.queue.writeBuffer(connectionDataGPUIn, 0, connectionDataCPU);

async function update(dt: number) {
    updateTimings.push(dt);
    uniformsBuffer[DT] = dt;

    device.queue.writeBuffer(ballDataGPUIn, 0, ballDataCPU);
    device.queue.writeBuffer(uniformsBufferIn, 0, uniformsBuffer);

    const commandEncoder = device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(computePipeline);
    for(let i = 0; i < bindGroups.length; ++i) {
        computePass.setBindGroup(i, bindGroups[i]);
    }
    computePass.dispatchWorkgroups(Math.ceil(balls.length / WORK_GROUP_SIZE));
    computePass.end();

    commandEncoder.copyBufferToBuffer(ballDataGPUOut, 0, ballDataGPUReadable, 0, ballDataGPUOut.size);

    const commands = commandEncoder.finish();

    device.queue.submit([commands]);

    await ballDataGPUReadable.mapAsync(GPUMapMode.READ);
    const gpuToCpuArrayBuffer = ballDataGPUReadable.getMappedRange();
    const dump = new Uint8Array(gpuToCpuArrayBuffer);
    ballDataCPU.set(dump);
    ballDataGPUReadable.unmap();
}

function render(evt: TimerTickEvent) {
    renderTimings.push(.001 * evt.dt);
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.save();
    g.scale(canvas.width, canvas.height);
    for(const ball of balls) {
        ball.draw(g, invWidth, invHeight);
    }
    g.restore();
}

function _resize() {
    width = canvas.width = canvas.clientWidth * devicePixelRatio;
    height = canvas.height = canvas.clientHeight * devicePixelRatio;
    invWidth = 1 / width;
    invHeight = 1 / height;
}

function feat(name: GPUFeatureName) {
    if (adapter.features.has(name)) {
        return name;
    }

    return null;
}

function animateAsync(callback: (dt?: number, t?: number) => Promise<void>) {
    let lt = 0.001 * performance.now();
    const anim = () => {
        const t = 0.001 * performance.now();
        const dt = t - lt;
        lt = t;
        callback(dt, t).then(anim);
    };
    anim();
}