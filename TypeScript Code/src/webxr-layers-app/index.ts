import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Jpeg, Image_Png } from "@juniper-lib/mediatypes";
import { objGraph } from "@juniper-lib/threejs/objects";
import { Image2D } from "@juniper-lib/threejs/widgets/Image2D";
import { deg2rad } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";
import { isDebug } from "../isDebug";

(async function () {
    const env = await createTestEnvironment();
    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    const picture = new AssetImage("/img/logos/foxglove.png", Image_Png, !isDebug);
    const img = new Image2D(env, "Foxglove", "static");

    Object.assign(window, { img });
    objGraph(env.foreground, img);

    await env.fadeOut();
    await env.load(skybox, picture);

    env.eventSys.mouse.allowPointerLock = true;

    env.skybox.setImage(skybox.path, skybox.result);
    env.skybox.rotation = deg2rad(176);

    img.setTextureMap(picture.result);
    img.position.set(0, 1.5, -3);

    await env.fadeIn();
})();