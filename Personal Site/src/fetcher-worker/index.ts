import { FetchingServiceImplXHR as FetchingServiceImpl, FetchingServiceServer } from "@juniper-lib/fetcher";
(globalThis as any).server = new FetchingServiceServer(
    (globalThis as any) as DedicatedWorkerGlobalScope,
    new FetchingServiceImpl());