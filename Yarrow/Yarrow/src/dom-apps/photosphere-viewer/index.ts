import { getCanvas } from "@juniper-lib/dom/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { BaseEnvironment } from "@juniper-lib/threejs/environment/BaseEnvironment";
import { createFetcher } from "../../createFetcher";
import { getDOMStyleUrl } from "../../settings";

(async function () {
    const url = new URL(location.href);
    const fileID = url.searchParams.get("FileID");
    const fetcher = createFetcher();
    const env = new BaseEnvironment(
        getCanvas("#frontBuffer"),
        getDOMStyleUrl("photosphere-viewer"),
        fetcher,
        false);
    await env.withFade(async () => {
        const path = `/vr/file/${fileID}`;
        const image = await fetcher
            .get(path)
            .progress(env.loadingBar)
            .image()
            .then(unwrapResponse);
        await env.skybox.setImage(path, image);
    });
})();