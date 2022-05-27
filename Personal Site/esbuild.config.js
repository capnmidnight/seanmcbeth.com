import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";

await new Build(process.argv.slice(2))
    .plugin((minify) => glsl({ minify }))
    .external("three")

    .bundle("junk-app")

    .run();