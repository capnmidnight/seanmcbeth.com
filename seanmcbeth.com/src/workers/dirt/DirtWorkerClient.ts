import { assertNever } from "@juniper-lib/tslib/dist/typeChecks";
import { WorkerClient } from "@juniper-lib/workers/dist/WorkerClient";
import { WorkerServerEventMessage } from "@juniper-lib/workers/dist/WorkerMessages";
import { DirtEventMap, DirtServiceUpdateEvent, IDirtService } from "./DirtService";

export class DirtWorkerClient
    extends WorkerClient<DirtEventMap>
    implements IDirtService {

    private readonly updateEvt = new DirtServiceUpdateEvent();

    protected override propogateEvent(data: WorkerServerEventMessage<DirtEventMap>): void {
        if (data.eventName === "update") {
            this.updateEvt.imgBmp = data.data;
            this.dispatchEvent(this.updateEvt);
        }
        else {
            assertNever(data.eventName);
        }
    }

    private readonly checkPointerParams: [string | number, number, number, string | number] = [null, null, null, null];
    private setParams(id: string | number, x: number, y: number, type: string | number) {
        this.checkPointerParams[0] = id;
        this.checkPointerParams[1] = x;
        this.checkPointerParams[2] = y;
        this.checkPointerParams[3] = type;
    }

    init(width: number, height: number, fr: number, pr: number): Promise<void> {
        this.setParams(width, height, fr, pr);
        return this.callMethod("init", this.checkPointerParams);
    }

    checkPointer(id: string | number, x: number, y: number, type: string): void {
        this.setParams(id, x, y, type);
        this.callMethod("checkPointer", this.checkPointerParams);
    }

    checkPointerUV(id: number | string, x: number, y: number, type: string) {
        this.setParams(id, x, y, type);
        this.callMethod("checkPointerUV", this.checkPointerParams);
    }
}