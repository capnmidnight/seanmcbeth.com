import { CancelToken } from "@juniper-lib/events/dist/CancelToken";
import { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Application_Javascript } from "@juniper-lib/mediatypes/dist";
import { Exception } from "@juniper-lib/tslib/dist/Exception";
import { isFirefox } from "@juniper-lib/tslib/dist/flags";
import { isBoolean } from "@juniper-lib/tslib/dist/typeChecks";
import { createFetcher } from "../../createFetcher";
import { getLibScriptUrl, getWorkerUrl } from "../../settings";
import { IPhotosphereRig, StreetViewPhotosphereRig } from "./StreetViewPhotosphereRig";
import { StreetViewPhotosphereServiceClient } from "./StreetViewPhotosphereServiceClient";
import { StreetViewPhotosphereServicePool } from "./StreetViewPhotosphereServicePool";

export function createPhotosphereCaptureRig(fetcher: IFetcher, token: CancelToken, enableWorkers?: boolean): Promise<IPhotosphereRig>
export function createPhotosphereCaptureRig(fetcher: IFetcher, enableWorkers?: boolean): Promise<IPhotosphereRig>
export async function createPhotosphereCaptureRig(fetcher: IFetcher, tokenOrEnableWorkers: CancelToken | boolean, enableWorkers?: boolean): Promise<IPhotosphereRig> {
    let token: CancelToken = null;
    if (isBoolean(tokenOrEnableWorkers)) {
        enableWorkers = tokenOrEnableWorkers;
    }
    else {
        token = tokenOrEnableWorkers;
    }

    token = token || new CancelToken();

    if (IS_WORKER && enableWorkers) {
        throw new Exception("Cannot create a Photosphere Capture Rig in a worker. Use StreetViewPhotosphereRig directly.");
    }

    if (!isFirefox() && enableWorkers) {
        const threejs = await fetcher
            .get(getLibScriptUrl("three"))
            .text()
            .then(unwrapResponse);
        token.check();
        const worker = await fetcher
            .get(getWorkerUrl("photosphere-capture"))
            .text()
            .then(unwrapResponse);
        token.check();
        const script = threejs + worker;
        const blob = new Blob([script], {
            type: Application_Javascript.value
        });
        const scriptPath = URL.createObjectURL(blob);
        return new StreetViewPhotosphereServicePool(
            { scriptPath },
            StreetViewPhotosphereServiceClient)
    }
    else {
        fetcher = fetcher || createFetcher(false);
        return new StreetViewPhotosphereRig(fetcher);
    }
}
