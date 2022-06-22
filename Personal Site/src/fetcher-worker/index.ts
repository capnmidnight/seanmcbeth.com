import { FetchingServiceImplXHR as FetchingServiceImpl } from "@juniper-lib/fetcher";
import { FetchingServiceServer } from "@juniper-lib/fetcher-worker/src/FetchingServiceServer";
(globalThis as any).server = new FetchingServiceServer(
    (globalThis as any) as DedicatedWorkerGlobalScope,
    new FetchingServiceImpl());