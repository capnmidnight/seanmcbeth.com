import { Build, runBuilds } from "@juniper-lib/esbuild";

const args = process.argv.slice(2);

await runBuilds(
    findBundles(false, "./Pages"),
    findBundles(true, "./workers")
);

function findBundles(isWorker, ...dirs) {
    return new Build(args, isWorker)
        .outBase("./")
        .outDir("wwwroot/js")
        .find(...dirs);
}