import { WorkerServer } from "@juniper-lib/workers/WorkerServer";
import { createFetcher } from "../../createFetcher";
import { StreetViewPhotosphereRig } from "../../vr-apps/yarrow/StreetViewPhotosphereRig";

const worker = new WorkerServer(self as any);
const fetcher = createFetcher(false);
const rig = new StreetViewPhotosphereRig(fetcher);

worker.addVoidMethod(rig, "init", rig.init);
worker.addMethod(rig, "loadFile", rig.loadFile);
worker.addMethod(rig, "loadFiles", rig.loadFiles);