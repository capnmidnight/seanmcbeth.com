import { WorkerServer } from "@juniper-lib/workers";
import { DirtEventMap, DirtService } from "./DirtService";

export class DirtWorkerServer extends WorkerServer<DirtEventMap> {
    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const dirtService = new DirtService();
        this.addMethod(dirtService, "init", dirtService.init.bind(dirtService));
        this.addVoidMethod(dirtService, "checkPointer", dirtService.checkPointer.bind(dirtService));
        this.addEvent(dirtService, "update");
    }
}