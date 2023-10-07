import { CanvasTypes } from "@juniper-lib/dom/dist/canvas";
import { TypedEventMap } from "@juniper-lib/events/dist/TypedEventTarget";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/dist/PhotosphereRig";
import { FullWorkerClientOptions } from "@juniper-lib/workers/dist/WorkerClientOptions";
import { WorkerConstructorT, WorkerPool } from "@juniper-lib/workers/dist/WorkerPool";
import { IPhotosphereRig } from "./StreetViewPhotosphereRig";
import { StreetViewPhotosphereServiceClient } from "./StreetViewPhotosphereServiceClient";

export class StreetViewPhotosphereServicePool
    extends WorkerPool<TypedEventMap<never>, StreetViewPhotosphereServiceClient>
    implements IPhotosphereRig {

    constructor(options: FullWorkerClientOptions, WorkerClientClass: WorkerConstructorT<TypedEventMap<never>, StreetViewPhotosphereServiceClient>) {
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