import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "./Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env);
await env.load(...forest.assets)

await env.fadeIn();