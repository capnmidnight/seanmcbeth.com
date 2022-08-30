import { htmlHeight, htmlWidth } from "@juniper-lib/dom/attrs";
import { px, touchAction, width } from "@juniper-lib/dom/css";
import { onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerRawUpdate, onPointerUp } from "@juniper-lib/dom/evts";
import { Canvas, elementApply } from "@juniper-lib/dom/tags";
import { Application_Javascript } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";
import { DirtWorkerClient } from "../dirt-worker/DirtWorkerClient";
import { isDebug, JS_EXT } from "../isDebug";
import { version } from "../settings";

const fetcher = createFetcher();

(async function () {

    const R = 200;
    const F = 2;
    const P = 1;

    const canv = Canvas(htmlWidth(R), htmlHeight(R));
    const g = canv.getContext("2d");

    const dirt = new DirtWorkerClient(await fetcher
        .get(`/js/dirt-worker/index${JS_EXT}?${version}`)
        .useCache(!isDebug)
        .accept(Application_Javascript)
        .worker());

    dirt.addEventListener("update", (evt) => {
        g.drawImage(evt.imgBmp, 0, 0, evt.imgBmp.width, evt.imgBmp.height, 0, 0, canv.width, canv.height);
        evt.imgBmp.close();
    });

    await dirt.init(R, R, F, P);

    elementApply(document.body,
        elementApply(
            canv,
            onPointerCancel(checkPointer),
            onPointerDown(checkPointer),
            onPointerEnter(checkPointer),
            onPointerLeave(checkPointer),
            onPointerRawUpdate(checkPointer),
            onPointerUp(checkPointer),
            touchAction("none"),
            width(px(600))
        )
    );

    function checkPointer(evt: PointerEvent) {
        dirt.checkPointer(evt.pointerId,
            evt.offsetX * canv.width / canv.clientWidth,
            evt.offsetY * canv.height / canv.clientHeight,
            evt.type);
    }
})();