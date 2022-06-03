﻿import type { IFetcher } from "@juniper-lib/fetcher";
import { Fetcher, FetchingService, FetchingServiceClient, FetchingServiceImplXHR as FetchingServiceImpl, FetchingServicePool, IFetchingService } from "@juniper-lib/fetcher/impl";
import { isWorker } from "@juniper-lib/tslib";
import { version } from "./settings";

export function createFetcher(enableWorkers = true): IFetcher {
    let fallback: IFetchingService = new FetchingService(new FetchingServiceImpl());

    if (!isWorker && enableWorkers) {
        fallback = new FetchingServicePool({
            scriptPath: `/js/fetcher-worker/index${JS_EXT}?${version}`
        }, FetchingServiceClient, fallback);
    }

    return new Fetcher(fallback);
}