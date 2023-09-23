import { id } from "@juniper-lib/dom/attrs";
import { position, rule } from "@juniper-lib/dom/css";
import { Canvas, Div, elementApply, Style } from "@juniper-lib/dom/tags";
import { tilReady } from "@juniper-lib/dom/tilReady";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { createFetcher } from "./createFetcher";
import { isDebug } from "./isDebug";
import {
    BasicLabelColor,
    defaultFont,
    DLSBlue,
    enableFullResolution,
    getAppScriptUrl,
    getUIImagePaths,
    loadFonts
} from "./settings";

Style(rule("#appContainer, #frontBuffer", position("relative")));

export async function createTestEnvironment(): Promise<Environment> {

    const canvas = Canvas(id("frontBuffer"));
    const container = Div(
        id("appContainer"),
        canvas
    );

    elementApply("main", container);

    await loadFonts();
    const fetcher = createFetcher(false);

    const env = new Environment({
        canvas,
        fetcher,
        dialogFontFamily: defaultFont.fontFamily,
        getAppUrl: getAppScriptUrl,
        uiImagePaths: getUIImagePaths(),
        buttonFillColor: DLSBlue,
        labelFillColor: BasicLabelColor,
        enableFullResolution,
        DEBUG: isDebug,
        watchModelPath: "/models/watch1.glb"
    });

    container.style.display = "none";

    await tilReady("main", env.audio);

    container.style.display = "";

    return env;
}