import { AssetImage } from "@juniper-lib/fetcher/dist/Asset";
import { Image_Jpeg, Image_Png } from "@juniper-lib/mediatypes";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { Image2D } from "@juniper-lib/threejs/dist/widgets/Image2D";
import { deg2rad } from "@juniper-lib/tslib/dist/math";
import { withTestEnvironment } from "../../createTestEnvironment";
import { isDebug } from "../../isDebug";

withTestEnvironment(async (env) => {
    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    const picture = new AssetImage("/img/logos/foxglove.png", Image_Png, !isDebug);
    const img = new Image2D(env, "Foxglove", "static");

    Object.assign(window, { img });
    objGraph(env.foreground, img);

    await env.load(skybox, picture);

    env.eventSys.mouse.allowPointerLock = true;

    env.skybox.setImage(skybox.path, skybox.result);
    env.skybox.rotation = deg2rad(176);

    img.setTextureMap(picture.result);
    img.position.set(0, 1.5, -3);
});