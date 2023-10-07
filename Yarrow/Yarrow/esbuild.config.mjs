import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

await Promise.all([
    findBundles(false, false,
        "./src",
        "./src/dom-apps",
        "./src/tests",
        "./src/vr-apps"
    ),
    findBundles(false, true,
        "./src/libs"
    ),
    findBundles(true, false,
        "./src/workers"
    )
]);

function findBundles(isWorker, isThree, ...dirs) {
    return new Build(args, isWorker)
        .plugin((minify) => glsl({ minify }))
        .addThreeJS(!isThree)
        .outDir("../Yarrow/wwwroot/js/")
        .find(...dirs)
        .run();
}