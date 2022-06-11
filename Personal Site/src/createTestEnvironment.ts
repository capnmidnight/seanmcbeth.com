import { id } from "@juniper-lib/dom/attrs";
import { Canvas, Div } from "@juniper-lib/dom/tags";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { createFetcher } from "./createFetcher";
import { defaultAvatarHeight, defaultFont, enableFullResolution, getUIImagePaths, loadFonts } from "./settings";

export async function createTestEnvironment(debug = true): Promise<Environment> {

    const canvas = Canvas(
        id("frontBuffer")
    );

    document.body.append(
        Div(
            id("appContainer"),
            canvas
        )
    );

    await loadFonts();
    
    const fetcher = createFetcher(!debug);

    return new Environment(
        canvas,
        fetcher,
        defaultFont.fontFamily,
        getUIImagePaths(),
        defaultAvatarHeight,
        enableFullResolution, {
        DEBUG: debug
    });
}