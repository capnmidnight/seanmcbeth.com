import { JS_EXT } from "../isDebug";
import { loadScripts } from "./ScriptLoader";

function onProgress(soFar: number, total: number, msg?: string) {
    console.log(msg, (100 * soFar / (total || 1)).toFixed(1) + "%");
}

(async function () {
    const [_, loadEditor] = await loadScripts(
        JS_EXT,
        onProgress,
        ["three", () => (globalThis as any).THREE],
        "editor"
    );

    await loadEditor();
})();