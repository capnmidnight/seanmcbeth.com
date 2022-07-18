import { styles, touchAction, width } from "@juniper-lib/dom/css";
import { onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerRawUpdate, onPointerUp } from "@juniper-lib/dom/evts";
import { elementApply } from "@juniper-lib/dom/tags";
import { Application_Javascript } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";
import { DirtWorkerClient } from "../dirt-worker/DirtWorkerClient";
import { JS_EXT } from "../isDebug";

const fetcher = createFetcher();

(async function () {

    const R = 200;
    const F = 2;
    const P = 1;

    const dirt = new DirtWorkerClient(R, F, P, await fetcher
        .get("/js/dirt-worker/index" + JS_EXT)
        .accept(Application_Javascript)
        .worker());
    await dirt.ready;


    elementApply(document.body,
        elementApply(
            dirt,
            onPointerCancel(checkPointer),
            onPointerDown(checkPointer),
            onPointerEnter(checkPointer),
            onPointerLeave(checkPointer),
            onPointerRawUpdate(checkPointer),
            onPointerUp(checkPointer),
            styles(
                touchAction("none"),
                width("600px")
            )
        )
    );

    function checkPointer(evt: PointerEvent) {
        dirt.checkPointer(evt.pointerId,
            evt.offsetX * dirt.element.width / dirt.element.clientWidth,
            evt.offsetY * dirt.element.height / dirt.element.clientHeight,
            evt.type);
    }
})();