import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

const args = process.argv.slice(2);

const juniper = new Build(args)
    .plugin((minify) => glsl({ minify }))
    .external("three")
    .rootDir("../Juniper/src/Juniper.TypeScript")
    .outBase("../Juniper/src/Juniper.TypeScript")
    .entryName("[name]")
    .outDir("wwwroot/js")

    .bundle("environment/src")
    .run();

const site = new Build(args)
    .plugin((minify) => glsl({ minify }))
    .external("three")
    .rootDir("src")
    .outBase("src")
    .entryName("[dir]/[name]")
    .outDir("wwwroot/js")

    .bundle("junk")
    .run();

await Promise.all([
    juniper,
    site
]);