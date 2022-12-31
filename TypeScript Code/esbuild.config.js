import { Build } from "@juniper-lib/esbuild";
import { glsl } from "esbuild-plugin-glsl";
import { readdirSync, existsSync } from "fs";
import path from "path";

const bundleApps = findEntries(
    LS("./src"),
    LS("./src/apps"),
    LS("./src/tests")
);

const workerApps = findEntries(
    LS("./src/workers")
);

const args = process.argv.slice(2);

await Promise.all([
    makeBuild(bundleApps, false).run(),
    makeBuild(workerApps, true).run()
]);

function LS(path) {
    if (!existsSync(path)) {
        return null;
    }

    return [path, readdirSync(path, {
        withFileTypes: true
    })];
}

function findEntries(...dirs) {
    return dirs
        .filter(identity)
        .map(withIndexDirs)
        .flatMap(identity);
}

function identity(x) {
    return x;
}

function withIndexDirs(dirSpec) {
    const [parent, dirs] = dirSpec;
    return dirs
        .filter(dir => hasIndexFile(parent, dir))
        .map(dir => path.join(parent, dir.name));
}

function hasIndexFile(parent, dir) {
    if (!dir.isDirectory()) {
        return false;
    }

    const fileName = path.join(parent, dir.name);
    const [_, files] = LS(fileName);

    return files.filter(f => f.isFile()
        && f.name === "index.ts")
        .length === 1;
}

function makeBuild(apps, isWorker) {
    return new Build(args, isWorker)
        .plugin((minify) => glsl({ minify }))
        .addThreeJS()
        .outDir("../Personal Site/wwwroot/js/")
        .bundles(apps);
}