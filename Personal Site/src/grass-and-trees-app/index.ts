import { Asset } from "@juniper-lib/fetcher";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";
import { makeGrass } from "../grass-app/makeGrass";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, true, 0.02);
const [spatter] = await forest.load(new Asset("/img/spatter.png", forest.getPng));

makeGrass(env, spatter.result);

await env.fadeIn();