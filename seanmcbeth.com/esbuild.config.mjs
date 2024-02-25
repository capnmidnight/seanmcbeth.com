import { Build, runBuilds } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

await runBuilds(
    findBundles(false, false,
        "./src",
        "./src/apps",
        "./src/tests"
    ),
    findBundles(true, false,
        "./src/workers"
    )
);

function findBundles(isWorker, isThree, ...dirs) {
    return new Build(args, isWorker)
        .plugin((minify) => glsl({ minify }))
        .splitting(!isWorker && !isThree && false)
        .external("three", !isWorker && !isThree)
        .outDir("./wwwroot/js/")
        .find(...dirs);
}