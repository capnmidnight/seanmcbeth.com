import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { createTestEnvironment } from "../../createTestEnvironment";

(async function () {
    const env = await createTestEnvironment();
    await env.withFade(async () => {
        const skybox = new AssetImage("/vr/LandingPageImage");
        await env.load(skybox);
        env.skybox.setImage(skybox.path, skybox.result);
    });
    env.testSpaceLayout = true;

    const btn1 = await env.uiButtons.getMeshButton("media", "play", 0.2);
    btn1.enabled = false;
    btn1.object.position.set(-0.1, 1.75, -2);
    btn1.addEventListener("click", (evt) => console.log("enter 1", evt.hit.instanceId));
    env.foreground.add(btn1.object);

    const btn2 = await env.uiButtons.getMeshButton("media", "pause", 0.2);
    btn2.enabled = true;
    btn2.object.position.set(0.1, 1.75, -2);
    btn2.addEventListener("click", (evt) => console.log("enter 2", evt.hit.instanceId));
    env.foreground.add(btn2.object);
})();