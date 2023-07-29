import { touchAction } from "@juniper-lib/dom/css";
import { onTouchCancel, onTouchEnd, onTouchMove, onTouchStart } from "@juniper-lib/dom/evts";
import { Div, HtmlRender, elementSetText } from "@juniper-lib/dom/tags";

HtmlRender(document.body,
    touchAction("none"),
    onTouchStart(handle),
    onTouchMove(handle),
    onTouchCancel(handle),
    onTouchEnd(handle)
);

const touchStates = new Map<number, HTMLDivElement>();

function handle(evt: TouchEvent) {
    const found = new Set<number>();
    for (const touch of evt.touches) {
        found.add(touch.identifier);
        if (!touchStates.has(touch.identifier)) {
            const tag = Div();
            touchStates.set(touch.identifier, tag);
            HtmlRender("main", tag);
        }

        const tag = touchStates.get(touch.identifier);
        elementSetText(tag, `[${evt.type} ${touch.identifier}] <${touch.clientX}, ${touch.clientY}>`);
    }

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