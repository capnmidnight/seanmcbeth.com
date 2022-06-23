import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "./Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env, true);
await env.load(...forest.assets)

await env.fadeIn();