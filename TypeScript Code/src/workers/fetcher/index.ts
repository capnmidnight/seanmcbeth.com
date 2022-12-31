import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/FetchingServiceImplXHR";
import { FetchingServiceServer } from "@juniper-lib/fetcher/FetchingServiceServer";

(globalThis as any).server = new FetchingServiceServer(
    (globalThis as any) as DedicatedWorkerGlobalScope,
    new FetchingServiceImplXHR());