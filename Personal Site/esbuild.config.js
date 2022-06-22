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

const build = new Build(process.argv.slice(2))
    .plugin((minify) => glsl({ minify }))
    .external("three")
    .outDir("wwwroot/js");

for (const app of apps) {
    console.log(build.buildType, app);
    build.bundle(app);
}

await build.run();