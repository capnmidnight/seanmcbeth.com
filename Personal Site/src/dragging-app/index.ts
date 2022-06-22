import { Cube } from "@juniper-lib/threejs/Cube";
import { lit } from "@juniper-lib/threejs/materials";
import { objGraph } from "@juniper-lib/threejs/objects";
import { TransformEditor } from "@juniper-lib/threejs/TransformEditor";
import { createTestEnvironment } from "../createTestEnvironment";

const env = await createTestEnvironment();

await env.fadeOut();
await env.load(env.loadingBar);

const obj = new Cube(0.25, 0.25, 0.25, lit({
    color: "red"
}));

obj.position.set(0, 1.75, -2);;

objGraph(env.foreground,
    objGraph(obj,
        new TransformEditor(false, 1.75)
    )
);

await env.fadeIn();