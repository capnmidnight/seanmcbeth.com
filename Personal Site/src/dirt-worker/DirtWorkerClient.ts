import { createCanvas } from "@juniper-lib/dom/canvas";
import { ErsatzElement } from "@juniper-lib/dom/tags";
import { assertNever, TypedEvent } from "@juniper-lib/tslib";
import { WorkerClient, WorkerServerEventMessage } from "@juniper-lib/workers";
import { DirtEventMap, IDirtService } from "./DirtService";

export class DirtWorkerClient
    extends WorkerClient<DirtEventMap>
    implements IDirtService, ErsatzElement {

    readonly element: HTMLCanvasElement;
    readonly ready: Promise<void>;
    private readonly updateEvt = new TypedEvent("update");

    constructor(n: number, fr: number, pr: number, worker: Worker) {
        super(worker);
        this.element = createCanvas(n, n);
        const offscreen = this.element.transferControlToOffscreen();
        this.ready = this.callMethod("init", [offscreen, fr, pr], [offscreen]);
    }

    protected override propogateEvent(data: WorkerServerEventMessage<DirtEventMap>): void {
        if (data.eventName === "update") {
            this.dispatchEvent(this.updateEvt);
        }
        else {
            assertNever(data.eventName);
        }
    }

    private readonly checkPointerParams: [string | number, number, number, string] = [null, 0, 0, null];

    checkPointer(id: string | number, x: number, y: number, type: string): void {
        this.checkPointerParams[0] = id;
        this.checkPointerParams[1] = x;
        this.checkPointerParams[2] = y;
        this.checkPointerParams[3] = type;
        this.callMethod("checkPointer", this.checkPointerParams);
    }

    checkPointerUV(id: number | string, x: number, y: number, type: string) {
        this.checkPointer(id, x * this.element.width, y * this.element.height, type);
    }
}