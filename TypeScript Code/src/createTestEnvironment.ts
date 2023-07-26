import { ID } from "@juniper-lib/dom/attrs";
import { canvasToBlob, Context2D, createUICanvas } from "@juniper-lib/dom/canvas";
import { display, rgb } from "@juniper-lib/dom/css";
import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, Canvas, Div, elementApply, Elements } from "@juniper-lib/dom/tags";
import { IReadyable } from "@juniper-lib/events/IReadyable";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import type { Environment, EnvironmentModule } from "@juniper-lib/threejs/environment/Environment";
import { isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { toBytes } from "@juniper-lib/tslib/units/fileSize";
import { createFetcher } from "./createFetcher";
import { CSS_EXT, isDebug, JS_EXT } from "./isDebug";
import { defaultAvatarHeight, defaultFont, enableAnaglyph, enableFullResolution, getUIImagePaths, loadFonts, version } from "./settings";

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

    await loadFonts();

    const fetcher = createFetcher(!isDebug);

    const { default: EnvironmentConstructor } = await fetcher
        .get(`/js/environment/index${JS_EXT}?${version}`)
        .useCache(!isDebug)
        .module<EnvironmentModule>()
        .then(unwrapResponse);

    const canvas = Canvas(ID("frontBuffer"));
    const appContainer = Div(
        ID("appContainer"),
        display("none"),
        canvas
    );

    if (!appContainer.parentElement) {
        elementApply(document.body, appContainer);
    }

    const env = new EnvironmentConstructor({
        canvas,
        fetcher,
        dialogFontFamily: defaultFont.fontFamily,
        getAppUrl: name => `/js/apps/${name}/index${JS_EXT}?${version}`,
        uiImagePaths: getUIImagePaths(),
        buttonFillColor: rgb(30, 67, 136),
        labelFillColor: rgb(78, 77, 77),
        defaultFOV: 65,
        defaultAvatarHeight,
        enableFullResolution,
        enableAnaglyph,
        DEBUG: isDebug,
        watchModelPath: "/models/watch1.glb",
        styleSheetPath: `/js/environment/index${CSS_EXT}?${version}`
    });

    await tilReady("main", env.audio);

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
                const gResize = canvResize.getContext("2d", { alpha: false, desynchronized: true }) as Context2D;
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

    appContainer.style.removeProperty("display");
    return env;
}

export async function tilReady(root: string | Elements, obj: IReadyable) {
    if (!obj.isReady) {
        const button = ButtonPrimary(
            "Start",
            onClick(() => button.disabled = true, true));
        elementApply(root, button);
        await obj.ready;
        button.remove();
    }
}

export async function withTestEnvironment(action: (env: Environment) => Promise<any>): Promise<void> {
    const env = await createTestEnvironment();
    await env.withFade(() => action(env));
}