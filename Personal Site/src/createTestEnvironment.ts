import { id } from "@juniper-lib/dom/attrs";
import { canvasToBlob, createUICanvas } from "@juniper-lib/dom/canvas";
import { Canvas, Div } from "@juniper-lib/dom/tags";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { isNullOrUndefined, toBytes } from "@juniper-lib/tslib";
import { createFetcher } from "./createFetcher";
import { isDebug } from "./isDebug";
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
    const env = new Environment(
        canvas,
        fetcher,
        defaultFont.fontFamily,
        getUIImagePaths(),
        defaultAvatarHeight,
        enableFullResolution, {
        DEBUG: debug
    });

    if (isDebug) {
        const MAX_IMAGE_SIZE = toBytes(200, "KiB");
        window.addEventListener("keypress", async (evt) => {
            if (evt.key === "`") {
                env.drawSnapshot();
                const canv = env.renderer.domElement;
                const canvResize = createUICanvas(Math.floor(canv.width / 2), Math.floor(canv.height / 2));
                console.log(canvResize);
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

                    const file = URL.createObjectURL(blob);
                    window.open(file);

                    const form = new FormData();
                    form.append("File", blob, "thumbnail.jpg");
                    const result = await fetcher.post(location.href)
                        .body(form)
                        .exec();

                    console.log(result);
                }
            }
        });
    }

    return env;
}