import { scaleOnHover } from "@juniper-lib/threejs/animation/scaleOnHover";
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

scaleOnHover(obj);

obj.position.set(0, 1.75, -2);;

let transformer: TransformEditor;
objGraph(env.foreground,
    objGraph(obj,
        transformer = new TransformEditor(false, 1.75)
    )
);

console.log(transformer);

await env.fadeIn();