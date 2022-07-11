import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "./Forest";

(async function () {
    const env = await createTestEnvironment();
    await env.fadeOut();

    const forest = new Forest(env);
    await env.load(...forest.assets)

    await env.fadeIn();
})();