import { Asset } from "@juniper-lib/fetcher";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";
import { makeGrass } from "./makeGrass";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, true);
const [spatter] = await forest.load(new Asset("/img/spatter.png", forest.getPng));
forest.trees.removeFromParent();

makeGrass(env, spatter.result);

await env.fadeIn();