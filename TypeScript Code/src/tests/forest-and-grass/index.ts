import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { Image_Png } from "@juniper-lib/mediatypes";
import { withTestEnvironment } from "../../createTestEnvironment";
import { Forest } from "../../forest/Forest";
import { isDebug } from "../../isDebug";
import { makeGrass } from "../../forest/makeGrass";

withTestEnvironment(async (env) => {
    const forest = new Forest(env);
    const spatter = new AssetImage("/img/spatter.png", Image_Png, !isDebug);

    await env.load(spatter, ...forest.assets);

    makeGrass(env, spatter.result);
});