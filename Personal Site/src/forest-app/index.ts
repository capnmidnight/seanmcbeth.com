import { materialStandardToBasic } from "@juniper-lib/threejs/materials";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "./Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, materialStandardToBasic);
await env.load(...forest.assets)

await env.fadeIn();