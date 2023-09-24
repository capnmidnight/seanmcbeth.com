import { touchAction } from "@juniper-lib/dom/dist/css";
import { onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerMove, onPointerOut } from "@juniper-lib/dom/dist/evts";
import { Div, HtmlRender, elementSetText } from "@juniper-lib/dom/dist/tags";

HtmlRender(document.body,
    touchAction("none"),
    onPointerCancel(handle),
    onPointerDown(handle),
    onPointerEnter(handle),
    onPointerLeave(handle),
    onPointerMove(handle),
    onPointerOut(handle)
);

const touchStates = new Map<number, HTMLDivElement>();
const found = new Set<number>();

function handle(evt: PointerEvent) {
    found.add(evt.pointerId);
    if (!touchStates.has(evt.pointerId)) {
        const tag = Div();
        touchStates.set(evt.pointerId, tag);
        HtmlRender("main", tag);
    }

    const tag = touchStates.get(evt.pointerId);
    elementSetText(tag, `[${evt.type} ${evt.pointerType} ${evt.pointerId}] <${evt.clientX}, ${evt.clientY}>`);

    const toDelete = new Set<number>();
    for (const [key, value] of touchStates) {
        if (!found.has(key)) {
            toDelete.add(key);
            value.remove();
        }
    }

    for (const key of toDelete) {
        touchStates.delete(key);
    }
}

setInterval(() => {
    const toDelete = new Set<number>();
    for (const key of touchStates.keys()) {
        if (!found.has(key)) {
            toDelete.add(key);
        }
    }

    found.clear();

    for (const key of toDelete) {
        const elem = touchStates.get(key);
        elem.remove();
        touchStates.delete(key);
    }
}, 20);