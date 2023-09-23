import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { createTestEnvironment } from "../../createTestEnvironment";

(async function () {
    const env = await createTestEnvironment();
    await env.withFade(async () => {
        const skybox = new AssetImage("/vr/LandingPageImage");
        await env.load(skybox);
        env.skybox.setImage(skybox.path, skybox.result);
    });
})();

