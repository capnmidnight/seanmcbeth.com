import { id } from "@juniper-lib/dom/attrs";
import { canvasToBlob, createUICanvas } from "@juniper-lib/dom/canvas";
import { Canvas, Div } from "@juniper-lib/dom/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import type { Environment, EnvironmentModule } from "@juniper-lib/threejs/environment/Environment";
import { isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { toBytes } from "@juniper-lib/tslib/units/fileSize";
import { createFetcher } from "./createFetcher";
import { CSS_EXT, isDebug, JS_EXT } from "./isDebug";
import { defaultAvatarHeight, defaultFont, enableFullResolution, getUIImagePaths, loadFonts, version } from "./settings";

async function registerWorker() {
    const url = new URL(location.href);
    const scope = url.pathname;
    const registration = await navigator.serviceWorker.register(`${scope}.service?${version}`, { scope });
    const { active, installing, waiting } = registration;
    console.log("register", waiting, installing, active);
}

export async function createTestEnvironment(addServiceWorker = false): Promise<Environment> {

    if (addServiceWorker && "serviceWorker" in navigator) {
        registerWorker();
    }

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

    const fetcher = createFetcher(!isDebug);

    const { default: EnvironmentConstructor } = await fetcher
        .get(`/js/environment/index${JS_EXT}?${version}`)
        .useCache(!isDebug)
        .module<EnvironmentModule>()
        .then(unwrapResponse);

    const env = new EnvironmentConstructor(
        canvas,
        fetcher,
        defaultFont.fontFamily,
        getUIImagePaths(),
        "blue",
        "white",
        defaultAvatarHeight,
        65,
        enableFullResolution, {
            DEBUG: isDebug,
            watchModelPath: "/models/watch1.glb",
            styleSheetPath: `/js/environment/index${CSS_EXT}?${version}`
    });

    if (isDebug) {
        const MAX_IMAGE_SIZE = toBytes(200, "KiB");
        window.addEventListener("keypress", async (evt) => {
            if (evt.key === "`") {
                env.drawSnapshot();
                const canv = env.renderer.domElement;
                const aspectRatio = canv.width / canv.height;
                let width = 640;
                let height = 480;
                if (aspectRatio >= 1) {
                    width = height * aspectRatio;
                }
                else {
                    height = width / aspectRatio;
                }
                const canvResize = createUICanvas(width, height);
                const gResize = canvResize.getContext("2d", { alpha: false, desynchronized: true });
                gResize.drawImage(canv, 0, 0, canv.width, canv.height, 0, 0, canvResize.width, canvResize.height);
                let blob: Blob = null;
                for (let quality = 1; quality >= 0.05; quality -= 0.05) {
                    blob = await canvasToBlob(canvResize, Image_Jpeg.value, quality);
                    if (blob.size <= MAX_IMAGE_SIZE) {
                        break;
                    }
                }

                if (isNullOrUndefined(blob)) {
                    console.error("No image");
                }
                else {
                    if (blob.size > MAX_IMAGE_SIZE) {
                        console.warn("Image was pretty big");
                    }

                    const form = new FormData();
                    form.append("File", blob, "screenshot.jpg");
                    await fetcher.post(location.href)
                        .body(form)
                        .exec();
                }
            }
        });
    }

    return env;
}

export async function withTestEnvironment<T>(action: (env: Environment) => Promise<T>): Promise<T> {
    const env = await createTestEnvironment();
    return await env.withFade(() => action(env));
}