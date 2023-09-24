import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Cube } from "@juniper-lib/threejs/dist/Cube";
import { RayTarget } from "@juniper-lib/threejs/dist/eventSystem/RayTarget";
import { progressTasks } from "@juniper-lib/progress/dist/progressTasks";
import { BackSide, CubeTexture, ShaderMaterial, Uniform } from "three";
import { createTestEnvironment } from "../../createTestEnvironment";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

(async function () {
    const env = await createTestEnvironment();
    await env.fadeOut();

    const [img] = await progressTasks(env.loadingBar,
        prog => env.fetcher
            .get("/images/dls-waiting-area-cube.jpg")
            .progress(prog)
            .image()
            .then(unwrapResponse),
        prog => env.load(prog)
    );

    let images = env.skybox.sliceImage(img);
    env.skybox.setImages("bg", images);

    const map = new CubeTexture(images);
    map.needsUpdate = true;

    const mat = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: BackSide,
        uniforms: {
            envMap: new Uniform(map)
        }
    });

    const bg = new Cube(10, 10, 10, mat);
    env.foreground.add(bg);

    const target = new RayTarget(bg);
    target.clickable = true;
    target.addMesh(bg);

    target.addEventListener("click", (evt) => console.log("clicked", evt.hit.faceIndex, evt.hit.face.normal.toArray().join(", ")));

    await env.fadeIn();

    //env.addEventListener("update", () =>
    env.camera.getWorldPosition(bg.position)
    //);
})();
