import { ID } from "@juniper-lib/dom/dist/attrs";
import { position, rule } from "@juniper-lib/dom/dist/css";
import { Canvas, Div, HtmlRender, Style } from "@juniper-lib/dom/dist/tags";
import { tilReady } from "@juniper-lib/dom/dist/tilReady";
import { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { createFetcher } from "./createFetcher";
import { isDebug } from "./isDebug";
import {
    BasicLabelColor,
    DLSBlue,
    defaultFont,
    enableFullResolution,
    getAppScriptUrl,
    getUIImagePaths,
    loadFonts
} from "./settings";

Style(rule("#appContainer, #frontBuffer", position("relative")));

export async function createTestEnvironment(): Promise<Environment> {

    const canvas = Canvas(ID("frontBuffer"));
    const container = Div(
        ID("appContainer"),
        canvas
    );

    HtmlRender("main", container);

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