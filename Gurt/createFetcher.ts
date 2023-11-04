import { Fetcher } from "@juniper-lib/fetcher/dist/Fetcher";
import { FetchingService } from "@juniper-lib/fetcher/dist/FetchingService";
import { FetchingServiceImplXHR } from "@juniper-lib/fetcher/dist/FetchingServiceImplXHR";
import { FetchingServicePool } from "@juniper-lib/fetcher/dist/FetchingServicePool";
import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { IFetchingService } from "@juniper-lib/fetcher/dist/IFetchingService";
import { isDebug, JS_EXT } from "./isDebug";
import { version } from "./settings";

declare const IS_WORKER: boolean;

const GLOBAL_FETCHER_KEY = "JUNIPER::FETCHER";

export function createFetcher(enableWorkers = true): IFetcher {
    if(GLOBAL_FETCHER_KEY in window) {
        return window[GLOBAL_FETCHER_KEY] as IFetcher;
    }

    let fallback: IFetchingService = new FetchingService(new FetchingServiceImplXHR());

    if (!IS_WORKER && enableWorkers) {
        fallback = new FetchingServicePool({
            scriptPath: `/js/workers/fetcher/index${JS_EXT}?${version}`
        }, fallback);
    }

    const fetcher = new Fetcher(fallback, !isDebug);
    (window as any)[GLOBAL_FETCHER_KEY] = fetcher;
    return fetcher;
}
