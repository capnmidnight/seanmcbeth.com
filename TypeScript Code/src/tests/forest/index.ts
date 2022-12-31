import { withTestEnvironment } from "../../createTestEnvironment";
import { Forest } from "../../forest/Forest";

withTestEnvironment(async (env) => {
    const forest = new Forest(env);
    await env.load(...forest.assets);
    env.eventSys.mouse.allowPointerLock = true;
});