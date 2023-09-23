import { CanvasTypes } from "@juniper-lib/dom/canvas";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/PhotosphereRig";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { FullWorkerClientOptions } from "@juniper-lib/workers/WorkerClientOptions";
import { WorkerConstructorT, WorkerPool } from "@juniper-lib/workers/WorkerPool";
import { IPhotosphereRig } from "./StreetViewPhotosphereRig";
import { StreetViewPhotosphereServiceClient } from "./StreetViewPhotosphereServiceClient";

export class StreetViewPhotosphereServicePool
    extends WorkerPool<void, StreetViewPhotosphereServiceClient>
    implements IPhotosphereRig {

    constructor(options: FullWorkerClientOptions, WorkerClientClass: WorkerConstructorT<void, StreetViewPhotosphereServiceClient>) {
        if (options.workers !== 1) {
            options.workers = 1;
        }
        super(options, WorkerClientClass);
    }

    get canvases() {
        return this.peekWorker().canvases;
    }

    init(baseURL: string, isDebug: boolean): void {
        for (const worker of this.workers) {
            worker.init(baseURL, isDebug);
        }
    }

    loadImages(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<HTMLImageElement[]> {
        return this.nextWorker().loadImages(pano, level, progress);
    }

    loadCanvas(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<CanvasTypes> {
        return this.nextWorker().loadCanvas(pano, level, progress);
    }
}