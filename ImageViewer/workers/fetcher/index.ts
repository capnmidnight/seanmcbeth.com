import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/dist/FetchingServiceImplXHR";
import { FetchingServiceServer } from "@juniper-lib/fetcher/dist/FetchingServiceServer";

(globalThis as any).server = new FetchingServiceServer(
    (globalThis as any) as DedicatedWorkerGlobalScope,
    new FetchingServiceImplXHR());