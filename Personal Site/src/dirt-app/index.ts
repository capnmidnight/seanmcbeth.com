import { styles, touchAction } from "@juniper-lib/dom/css";
import { onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerMove, onPointerUp } from "@juniper-lib/dom/evts";
import { elementApply } from "@juniper-lib/dom/tags";
import { Dirt } from "@juniper-lib/graphics2d/Dirt";

const dirt = new Dirt(640, 480, 1);
elementApply(document.body,
    elementApply(dirt,
        styles(
            touchAction("none")
        ),
        onPointerCancel(checkPointer),
        onPointerDown(checkPointer),
        onPointerEnter(checkPointer),
        onPointerLeave(checkPointer),
        onPointerMove(checkPointer),
        onPointerUp(checkPointer)
    )
)

function checkPointer(evt: PointerEvent) {
    dirt.checkPointer(evt.pointerId,
        evt.offsetX,
        evt.offsetY,
        evt.type);
}