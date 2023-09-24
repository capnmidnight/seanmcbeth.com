import { Fetcher } from "@juniper-lib/fetcher/dist/Fetcher";
import { FetchingService } from "@juniper-lib/fetcher/dist/FetchingService";
import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/dist/FetchingServiceImplXHR";
import { FetchingServicePool } from "@juniper-lib/fetcher/dist/FetchingServicePool";
import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { IFetchingService } from "@juniper-lib/fetcher/dist/IFetchingService";
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
