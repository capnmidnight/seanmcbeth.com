import { Fetcher } from "@juniper-lib/fetcher/Fetcher";
import { FetchingService } from "@juniper-lib/fetcher/FetchingService";
import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/FetchingServiceImplXHR";
import { FetchingServicePool } from "@juniper-lib/fetcher/FetchingServicePool";
import type { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { IFetchingService } from "@juniper-lib/fetcher/IFetchingService";
import { isDebug, JS_EXT } from "./isDebug";
import { version } from "./settings";

export function createFetcher(enableWorkers = true): IFetcher {
    let fallback: IFetchingService = new FetchingService(new FetchingServiceImplXHR());

    if (!IS_WORKER && enableWorkers) {
        fallback = new FetchingServicePool({
            scriptPath: `/js/workers/fetcher/index${JS_EXT}?${version}`
        }, fallback);
    }

    return new Fetcher(fallback, !isDebug);
}
