import { DirtWorkerServer } from "./DirtWorkerServer";

(globalThis as any).server = new DirtWorkerServer((globalThis as any) as DedicatedWorkerGlobalScope);