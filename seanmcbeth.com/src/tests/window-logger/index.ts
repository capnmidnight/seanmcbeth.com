import { DebugLogger } from "@juniper-lib/testing/DebugLogger";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import type { Pointer3DEvent } from "@juniper-lib/threejs/eventSystem/devices/Pointer3DEvent";
import { withTestEnvironment } from "../../createTestEnvironment";
import { Forest } from "../../forest/Forest";

const logger = new DebugLogger();

withTestEnvironment(async (env) => {
    logger.log("instructions", "press Esc to toggle Debug Display");
    
    const forest = new Forest(env);
    await env.load(...forest.assets);


    const groundTarget = new RayTarget(forest.ground);
    groundTarget.addMesh(forest.ground);
    groundTarget.clickable = true;
    groundTarget.addEventListener("down", checkPointer);
    groundTarget.addEventListener("move", checkPointer);
    groundTarget.addEventListener("up", checkPointer);

    env.sun.position.set(-1, 3, -2);

    function checkPointer(evt: Pointer3DEvent) {
        logger.log("pointer:" + evt.pointer.type, evt.type, evt.hit.uv.x, evt.hit.uv.y)
    }
});