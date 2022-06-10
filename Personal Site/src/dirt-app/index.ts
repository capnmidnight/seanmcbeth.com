import { styles, touchAction } from "@juniper-lib/dom/css";
import { isModifierless, onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerMove, onPointerOut, onPointerOver, onPointerUp } from "@juniper-lib/dom/evts";
import { elementApply } from "@juniper-lib/dom/tags";
import { Dirt } from "@juniper-lib/graphics2d/Dirt";

const dirt = new Dirt(1024, 1024);

elementApply(
    document.body,
    elementApply(dirt,
        styles(
            touchAction("none")
        ),
        onPointerMove(checkPointer),
        onPointerDown(checkPointer),
        onPointerCancel(checkPointer),
        onPointerUp(checkPointer),
        onPointerLeave(checkPointer),
        onPointerEnter(checkPointer),
        onPointerOut(checkPointer),
        onPointerOver(checkPointer)
    )
);

function checkPointer(evt: PointerEvent) {
    if (!isModifierless(evt)) {
        dirt.stop();
    }
    else {
        let type = evt.type;
        if (type === "pointerenter"
            && evt.pointerType === "mouse"
            && evt.buttons === 1) {
            type = "pointerdown";
        }
        dirt.checkPointer(evt.pointerId, evt.offsetX, evt.offsetY, type);
    }
}