import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { Cube } from "@juniper-lib/threejs/Cube";
import { lit } from "@juniper-lib/threejs/materials";
import { objGraph } from "@juniper-lib/threejs/objects";
import { TransformEditor } from "@juniper-lib/threejs/TransformEditor";
import { deg2rad } from "@juniper-lib/tslib";
import { createTestEnvironment } from "../createTestEnvironment";

const env = await createTestEnvironment();
const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !DEBUG);
await env.fadeOut();
await env.load(skybox);

env.skybox.setImage(skybox.path, skybox.result);
env.skybox.rotation = deg2rad(176)

const obj = new Cube(0.25, 0.25, 0.25, lit({
    color: "yellow"
}));

const transformer = new TransformEditor(true, 1.75);
transformer.size = 2;

obj.position.set(0, 1.75, -2);

objGraph(env.foreground,
    objGraph(obj,
        transformer
    )
);

await env.fadeIn();