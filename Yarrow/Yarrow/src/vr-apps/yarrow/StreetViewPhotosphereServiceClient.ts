import { CanvasTypes, createCanvasFromImage, createImageFromFile } from "@juniper-lib/dom/dist/canvas";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/dist/PhotosphereRig";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { assertNever } from "@juniper-lib/tslib/dist/typeChecks";
import { WorkerClient } from "@juniper-lib/workers/dist/WorkerClient";
import { WorkerServerEventMessage } from "@juniper-lib/workers/dist/WorkerMessages";
import { IPhotosphereRig } from "./StreetViewPhotosphereRig";

export class StreetViewPhotosphereServiceClient
    extends WorkerClient<void>
    implements IPhotosphereRig {

    canvases: CanvasTypes[];

    init(baseURL: string, isDebug: boolean): void {
        this.callMethod("init", [baseURL, isDebug]);
    }

    protected propogateEvent(msg: WorkerServerEventMessage<void>): void {
        assertNever(msg.eventName)
    }

    private loadFiles(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<string[]> {
        return this.callMethod("loadFiles", [pano, level], progress);
    }

    private loadFile(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<string> {
        return this.callMethod("loadFile", [pano, level], progress);
    }

    async loadImages(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<HTMLImageElement[]> {
        const files = await this.loadFiles(pano, level, progress);
        return await Promise.all(files.map(createImageFromFile));
    }

    async loadCanvas(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<CanvasTypes> {
        const file = await this.loadFile(pano, level, progress);
        const img = await createImageFromFile(file);
        return createCanvasFromImage(img);
    }
}