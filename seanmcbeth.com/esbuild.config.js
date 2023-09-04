import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

await Promise.all([
    findBundles(false, false,
        "./src",
        "./src/apps",
        "./src/tests"
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
        .outDir("../seanmcbeth.com/wwwroot/js/")
        .find(...dirs)
        .run();
}