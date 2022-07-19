import type { IFetcher } from "@juniper-lib/fetcher";
import { Fetcher, FetchingService, FetchingServiceImplXHR as FetchingServiceImpl, FetchingServicePool, IFetchingService } from "@juniper-lib/fetcher";
import { isDebug, JS_EXT } from "./isDebug";
import { version } from "./settings";

export function createFetcher(enableWorkers = true): IFetcher {
    let fallback: IFetchingService = new FetchingService(new FetchingServiceImpl());

    if (!IS_WORKER && enableWorkers) {
        fallback = new FetchingServicePool({
            scriptPath: `/js/fetcher-worker/index${JS_EXT}?${version}`
        }, fallback);
    }

    return new Fetcher(fallback, !isDebug);
}
