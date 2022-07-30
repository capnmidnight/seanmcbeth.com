import { id } from "@juniper-lib/dom/attrs";
import { canvasToBlob, createUICanvas } from "@juniper-lib/dom/canvas";
import { Canvas, Div } from "@juniper-lib/dom/tags";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import type { Environment } from "@juniper-lib/threejs/environment/Environment";
import { EnvironmentModule } from "@juniper-lib/threejs/environment/EnvironmentModule";
import { isNullOrUndefined, toBytes } from "@juniper-lib/tslib";
import { createFetcher } from "./createFetcher";
import { isDebug, JS_EXT } from "./isDebug";
import { defaultAvatarHeight, defaultFont, enableFullResolution, getUIImagePaths, loadFonts, version } from "./settings";

export async function createTestEnvironment(addServiceWorker = false): Promise<Environment> {

    if (addServiceWorker && "serviceWorker" in navigator) {
        window.addEventListener("beforeinstallprompt", (e) => {
            console.log(e)
            Promise.all([
                e.prompt(),
                e.userChoice])
                .then((args) =>
                    console.log(args[1].outcome));
        });
        const url = new URL(location.href);
        const scope = url.pathname;
        const register = navigator.serviceWorker.register(`${scope}.service?${version}`, { scope });
        register.then(x => {
            console.log("register", x);
        });
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
        .module<EnvironmentModule>();

    const env = new EnvironmentConstructor(
        canvas,
        fetcher,
        defaultFont.fontFamily,
        getUIImagePaths(),
        defaultAvatarHeight,
        enableFullResolution, {
        DEBUG: isDebug
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