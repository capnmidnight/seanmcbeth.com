import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

await Promise.all([
    findBundles(false,
        "./src",
        "./src/apps",
        "./src/tests"
    ),
    findBundles(true,
        "./src/workers"
    )
]);

function findBundles(isWorker, ...dirs) {
    return new Build(args, isWorker)
        .plugin((minify) => glsl({ minify }))
        .addThreeJS()
        .outDir("../Personal Site/wwwroot/js/")
        .find(...dirs)
        .run();
}