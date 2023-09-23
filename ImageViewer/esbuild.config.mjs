import { Build } from "@juniper-lib/esbuild";

const args = process.argv.slice(2);

await Promise.all([
    findBundles(false,
        "./src"
    )
]);

function findBundles(isWorker, ...dirs) {
    return new Build(args, isWorker)
        .outDir("./wwwroot/js/")
        .find(...dirs)
        .run();
}