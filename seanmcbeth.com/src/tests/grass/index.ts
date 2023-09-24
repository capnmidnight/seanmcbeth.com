import { AssetImage } from "@juniper-lib/fetcher/dist/Asset";
import { Image_Png } from "@juniper-lib/mediatypes";
import { withTestEnvironment } from "../../createTestEnvironment";
import { Forest } from "../../forest/Forest";
import { makeGrass } from "../../forest/makeGrass";
import { isDebug } from "../../isDebug";

withTestEnvironment(async (env) => {
    const forest = new Forest(env);
    const spatter = new AssetImage("/img/spatter.png", Image_Png, !isDebug);
    await env.load(spatter, ...forest.assets);

    forest.trees.removeFromParent();

    makeGrass(env, spatter.result);
});