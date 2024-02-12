import { Build, runBuilds } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

await runBuilds(
    findBundles(false,
        "./src/apps",
        "./src/tests"
    ),
    findBundles(true, "./src/workers")
);

function findBundles(isWorker, ...dirs) {
    return new Build(args, isWorker)
        .plugin((minify) => glsl({ minify }))
        .splitting(true)
        .outDir("./wwwroot/js/")
        .find(...dirs);
}