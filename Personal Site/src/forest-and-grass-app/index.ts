﻿import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Png } from "@juniper-lib/mediatypes";
import { materialStandardToBasic } from "@juniper-lib/threejs/materials";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";
import { makeGrass } from "../grass-app/makeGrass";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, materialStandardToBasic);
const spatter = new AssetImage("/img/spatter.png", Image_Png, !DEBUG);

await env.load(spatter, ...forest.assets);

makeGrass(env, spatter.result);

await env.fadeIn();