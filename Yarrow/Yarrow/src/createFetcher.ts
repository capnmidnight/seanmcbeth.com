import { Fetcher } from "@juniper-lib/fetcher/Fetcher";
import { FetchingService } from "@juniper-lib/fetcher/FetchingService";
import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/FetchingServiceImplXHR";
import { FetchingServicePool } from "@juniper-lib/fetcher/FetchingServicePool";
import type { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { IFetchingService } from "@juniper-lib/fetcher/IFetchingService";
import { isDebug } from "./isDebug";
import { getWorkerUrl } from "./settings";

export function createFetcher(enableWorkers = true): IFetcher {
    let fallback: IFetchingService = new FetchingService(new FetchingServiceImplXHR());

    if (IS_WORKER && enableWorkers) {
        fallback = new FetchingServicePool({
            scriptPath: getWorkerUrl("fetcher")
        }, fallback);
    }

    return new Fetcher(fallback, !isDebug);
}
