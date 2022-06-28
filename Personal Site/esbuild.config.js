import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";
import { readdirSync } from "fs";

const dirs = readdirSync("./src", {
    withFileTypes: true
});

function hasIndexFile(dir) {
    if (!dir.isDirectory()) {
        return false;
    }

    const files = readdirSync("./src/" + dir.name, {
        withFileTypes: true
    });

    return files.filter(f => f.isFile()
        && f.name === "index.ts")
        .length === 1;
}

const apps = dirs
    .filter(hasIndexFile)
    .map(dir => dir.name);
const bundleApps = apps.filter(name => !name.endsWith("-worker"));
const workerApps = apps.filter(name => name.endsWith("-worker"));
const args = process.argv.slice(2);
const buildBundles = new Build(args, false)
    .plugin((minify) => glsl({ minify }))
    .external("three")
    .outDir("wwwroot/js")
    .bundles(bundleApps);
const buildWorkers = new Build(args, true)
    .plugin((minify) => glsl({ minify }))
    .external("three")
    .outDir("wwwroot/js")
    .bundles(workerApps);

await Promise.all([
    buildBundles.run(),
    buildWorkers.run()
]);