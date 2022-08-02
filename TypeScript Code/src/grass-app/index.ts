import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Png } from "@juniper-lib/mediatypes";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";
import { isDebug } from "../isDebug";
import { makeGrass } from "./makeGrass";

(async function () {
    const env = await createTestEnvironment();
    await env.fadeOut();
    const forest = new Forest(env);
    const spatter = new AssetImage("/img/spatter.png", Image_Png, !isDebug);
    await env.load(spatter, ...forest.assets);

    forest.trees.removeFromParent();

    makeGrass(env, spatter.result);

    await env.fadeIn();
})();