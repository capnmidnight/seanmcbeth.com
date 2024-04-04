
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
import { Uniforms } from "./Uniforms";

(async function () {

    if (!navigator.gpu) {
        throw new Exception("No WebGPU global singleton");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Exception("Couldn't create adapter");
    }

    function feat(name: GPUFeatureName) {
        if (adapter.features.has(name)) {
            return name;
        }

        return null;
    }

    const requiredFeatures = [feat("timestamp-query")].filter(isDefined);
    const device = await adapter.requestDevice({ requiredFeatures });
    if (!device) {
        throw new Exception("Couldn't create device");
    }

    const titleElement = H1(Query("main > h1"));
    const title = titleElement.innerText;
    const fetcher = createFetcher(false);
    const shaderAsset = new AssetWgslShader("/js/tests/webgpu/index.wgsl");
    await fetcher.assets(shaderAsset);
    const shader = shaderAsset.result;
    if (!shader.entryPoints.has("compute")) {
        throw new Exception("No compute shader found:\n" + shader.code)
    }
    const NUM_BALLS = shader.constants.get("NUM_BALLS");
    const WORK_GROUP_SIZE = shader.constants.get("WORK_GROUP_SIZE");
    
    const updateShader = device.createShaderModule({
        label: "Compute Shader",
        code: shader.code
    });
    
    await checkMessages("At shader creation", updateShader);
    const computePipeline = await device.createComputePipelineAsync({
        label: "computePipline",
        layout: "auto",
        compute: {
            module: updateShader,
            entryPoint: shader.entryPoints.get("compute")
        }
    });
    
    await checkMessages("At pipeline creation", updateShader);

    let cooling = false;
    const uniforms = new Uniforms();
    uniforms.limit = 200;
    uniforms.attract = 0.5;
    uniforms.repel = 0.1;
    uniforms.grav = 1.5;
    uniforms.k0 = 1.25;
    
    const canvas = Canvas(ID("frontBuffer"));
    const g = canvas.getContext("2d");
    const resize = debounce(() => {
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        const area = canvas.width * canvas.height;
        const c0 = 1;
        const c1 = 0.1;
        const c2 = 1.25;
        const c4 = 0.2;
        const c5 = 1.75;
        const k = c0 * Math.sqrt(c1 * area / NUM_BALLS);
        uniforms.k1 = c2 / k;
        uniforms.k2 = c4 * Math.pow(k, c5);
    });
    const resizer = new ResizeObserver((evts) => {
        for (const evt of evts) {
            if (evt.target === canvas) {
                resize();
            }
        }
    });

    resize();

    const { balls, ballData: ballsCPU, connectionData: connectionDataCPU } = Ball.create(NUM_BALLS, canvas.width, canvas.height);
    const ballsGPUIn = device.createBuffer({
        label: "ballDataGPUIn",
        size: ballsCPU.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    const ballGPUOut = device.createBuffer({
        label: "ballDataGPUOut",
        size: ballsCPU.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const ballsGPUReadable = device.createBuffer({
        label: "ballDataGPUReadable",
        size: ballsCPU.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    const uniformsGPU = device.createBuffer({
        label: "uniformsBuffer",
        size: uniforms.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const connectionsGPU = device.createBuffer({
        label: "connectionDataGPU",
        size: connectionDataCPU.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    const bindGroups = createGroups(device, computePipeline, [{
        label: "ballsIn",
        buffer: ballsGPUIn
    }, {
        label: "ballsOut",
        buffer: ballGPUOut
    }], [{
        label: "uniforms",
        buffer: uniformsGPU
    }, {
        label: "connections",
        buffer: connectionsGPU
    }]);

    device.queue.writeBuffer(connectionsGPU, 0, connectionDataCPU);

    const renderTimings = new RingBuffer<number>(10);
    const updateTimings = new RingBuffer<number>(10);
    const renderTimer = new RequestAnimationFrameTimer();
    const infoTimer = new SetIntervalTimer(1);

    renderTimer.addTickHandler(render);
    infoTimer.addTickHandler(info);

    resizer.observe(canvas);
    animateAsync(update);
    renderTimer.start();
    infoTimer.start();

    async function update(dt: number) {
        uniforms.dt = dt;
        updateTimings.push(dt);

        device.queue.writeBuffer(ballsGPUIn, 0, ballsCPU);
        device.queue.writeBuffer(uniformsGPU, 0, uniforms);

        const commandEncoder = device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        for (let i = 0; i < bindGroups.length; ++i) {
            computePass.setBindGroup(i, bindGroups[i]);
        }
        computePass.dispatchWorkgroups(Math.ceil(balls.length / WORK_GROUP_SIZE));
        computePass.end();

        commandEncoder.copyBufferToBuffer(ballGPUOut, 0, ballsGPUReadable, 0, ballGPUOut.size);

        const commands = commandEncoder.finish();

        device.queue.submit([commands]);

        await ballsGPUReadable.mapAsync(GPUMapMode.READ);
        const gpuToCpuArrayBuffer = ballsGPUReadable.getMappedRange();
        const dump = new Uint8Array(gpuToCpuArrayBuffer);
        ballsCPU.set(dump);
        ballsGPUReadable.unmap();

        if (cooling) {
            uniforms.limit *= 0.95;
        }
    }

    function render(evt: TimerTickEvent) {
        renderTimings.push(.001 * evt.dt);
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.save();
        g.translate(0.5 * canvas.width, 0.5 * canvas.height);

        g.strokeStyle = "white";
        g.lineWidth = 2;
        for(let i = 0; i < NUM_BALLS - 1; ++i) {
            const ball = balls[i];
            for(let j = i + 1; j < NUM_BALLS; ++j){
                if(ball.isConnected(j)) {
                    const other = balls[j];
                    g.beginPath();
                    g.moveTo(ball.pos.x, ball.pos.y);
                    g.lineTo(other.pos.x, other.pos.y);
                    g.stroke();
                }
            }
        }

        for(const ball of balls) {
            ball.draw(g);
        }
        g.restore();
    }

    function info() {
        if (renderTimings.length === 10 && updateTimings.length === 10) {
            const fr = renderTimings.reduce((a, b) => a + b / 10, 0);
            const fps = 1 / fr;
            const ur = updateTimings.reduce((a, b) => a + b / 10, 0);
            const ups = 1 / ur;
            titleElement.innerText = `${title} - ${fps.toFixed(0)}/${ups.toFixed(0)}`;
        }
    }
})();

function createGroups(device: GPUDevice, pipeline: GPUComputePipeline, ...entrieses: { label: string, buffer: GPUBuffer }[][]) {
    return entrieses.map((entries, group) => device.createBindGroup({
        label: `Group ${group}`,
        layout: pipeline.getBindGroupLayout(group),
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

async function checkMessages(location: string, shader: GPUShaderModule) {
    const compInfo = await shader.getCompilationInfo();
    const infos = compInfo.messages.filter(m => m.type === "info");
    const warnings = compInfo.messages.filter(m => m.type === "warning");
    const errors = compInfo.messages.filter(m => m.type === "error");

    for (const info of infos) {
        console.info(info);
    }

    for (const warning of warnings) {
        console.warn(warning);
    }

    if (errors.length > 0) {
        throw new Exception(`Shader compilation error (${location})`, errors);
    }
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