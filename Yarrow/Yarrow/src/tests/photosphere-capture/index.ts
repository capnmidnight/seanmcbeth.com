import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressTasks } from "@juniper-lib/progress/dist/progressTasks";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/dist/PhotosphereRig";
import { createTestEnvironment } from "../../createTestEnvironment";
import { createPhotosphereCaptureRig } from "../../vr-apps/yarrow/createPhotosphereCaptureRig";
import { PhotosphereMetadata } from "../../vr-apps/yarrow/data";

(async function () {
    const env = await createTestEnvironment();
    await env.fadeOut();
    const rig = await createPhotosphereCaptureRig(env.fetcher);
    rig.init(location.href, true);

    async function loadPhotospheres(prog: IProgress): Promise<void> {
        const photospheres = await env.fetcher
            .get("/editor/photospheres")
            .object<PhotosphereMetadata[]>()
            .then(unwrapResponse);

        const panos = photospheres.map(p => p.pano_id);
        const pano = arrayRandom(panos);

        let images = await rig.loadImages(pano, PhotosphereCaptureResolution.Low, prog);
        env.skybox.setImages(pano + "_low", images);
        env.fadeIn();
        images = await rig.loadImages(pano, PhotosphereCaptureResolution.High, prog);
        env.skybox.setImages(pano, images);
    }

    await progressTasks(env.loadingBar,
        prog => env.load(prog),
        loadPhotospheres
    );
})();
