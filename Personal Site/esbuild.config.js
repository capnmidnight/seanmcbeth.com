import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";
import { promises } from "fs";

const { readdir } = promises;

const dirs = await readdir("./src", {
    withFileTypes: true
});

const apps = dirs.filter(dir => dir.isDirectory() && dir.name.endsWith("-app"))
    .map(dir => dir.name);

const build = new Build(process.argv.slice(2))
    .plugin((minify) => glsl({ minify }))
    .external("three");

for (const app of apps) {
    console.log(build.buildType, app);
    build.bundle(app);
}

await build.run();