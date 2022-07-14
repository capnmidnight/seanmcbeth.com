import { src } from "@juniper-lib/dom/attrs";
import { CanvasImageTypes, Context2D, createCanvas, createUICanvas } from "@juniper-lib/dom/canvas";
import { ErsatzElement, Img } from "@juniper-lib/dom/tags";
import { singleton, TypedEvent, TypedEventBase } from "@juniper-lib/tslib";

type ActionTypes = "down" | "move" | "up";
const actionTypes = singleton("Juniper:Graphics2D:Dirt:StopTypes", () => new Map<string, ActionTypes>([
    ["mousedown", "down"],
    ["mouseenter", "move"],
    ["mouseleave", "up"],
    ["mousemove", "move"],
    ["mouseout", "up"],
    ["mouseover", "move"],
    ["mouseup", "up"],

    ["pointerdown", "down"],
    ["pointerenter", "move"],
    ["pointerleave", "up"],
    ["pointermove", "move"],
    ["pointerrawupdate", "move"],
    ["pointerout", "up"],
    ["pointerup", "up"],
    ["pointerover", "move"],

    ["touchcancel", "up"],
    ["touchend", "up"],
    ["touchmove", "move"],
    ["touchstart", "down"]
]));

interface DirtEventMap {
    "update": TypedEvent<"update">;
}

export class Dirt
    extends TypedEventBase<DirtEventMap>
    implements ErsatzElement {
    element: HTMLCanvasElement;

    private readonly finger: CanvasImageTypes;
    private readonly g: Context2D;
    private readonly updateEvt = new TypedEvent("update");

    private pointerId: number | string = null;
    private x: number = null;
    private y: number = null;
    private lx: number = null;
    private ly: number = null;

    constructor(width: number, height: number, private readonly fingerScale = 1) {
        super();
        this.element = createCanvas(width, height);

        this.g = this.element.getContext("2d");
        this.g.fillStyle = "rgb(50%, 50%, 50%)";
        this.g.fillRect(0, 0, this.element.width, this.element.height);

        this.finger = Img(src("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNi\
R0NAAAAAXNSR0IArs4c6QAAAqhJREFUOE+VVE1PE1EUPbfvDdOZUiwtdAr9pqQhZBIJQoCwYGX8SlgIaUgIEqb8AxQ2\
JP0Nuta1rtS4UH6CmBDcGqP+gS4waV3YwDP32akdLAl9yc3M3HnvvPt1DuGKpZSyARQBlAGU2s9oe/tXAK+J6PPl43T\
ZoZQSAJK1Wq1Sr9cfSClnR0dH47lc7rxYLP5mcxwnZBgGg78F8JiIvvs4AUAG29nZmT89PX0WDofnk8kkxsbGkE6nkc\
1mkclk9HsqlUI8HvcxfgLYIKIjdnQAlVLkuu6der3+MhqNxhKJBCzLghBCG7/zBeVyGYuLi1heXgZR5/g5gIdE9K7jc\
RzHbTabx7Zt25FIBFJKTE9Po1QqIRr9W7pWq6UtFAphYmIC6+vr3ZE2ANzyAckwjGPTNOc5EgZYXV1FLBbr2TKllI6O\
L97d3e3ed+QD3hVCfAiHwzBNE1tbWxgeHr5qAAL+8fFxDeqn7wM+F0JUGWxhYQErKyvXAvM3ra2twXVd/ekD/hBCFAz\
DgOd5uvj9rMnJSWxubv4DJKKWEEJyN/f393VX+1mDg4PY29sLRPhLSmlx9w4ODvoG5AAODw8DgF+EEGX+wQXuN+VeEb\
6QUno8e0tLS3035b8aArgnpXw/MDAAtu3t7WuPDefZq8s82J9M05zjeRoZGdGDfdUsXlxcaLbw6jmHzONUKuU2Go2PT\
D1mAtdlZmZGU6wX9ZhRzJRqtdp9cYcpYKWZmpq6fXZ29ioSidxgUE6fgYeGhgLGPr6oUql0064JYDagNgBsz/Nunpyc\
PLUsa862bZ0aD7yvNtyAa6kN10MpJQEwiWO1Wu1+t8Dm83ktsIVCgQVWtAWWj7HKPCKiNwE99JnhKzaAHCs3171tWQA\
ZAGkADoAEAAZ5QkTf/PN/ACV4rJ9AdCf3AAAAAElFTkSuQmCC"));
    }

    private update() {
        if (this.pointerId !== null) {
            const dx = this.lx - this.x;
            const dy = this.ly - this.y;
            if ((Math.abs(dx) + Math.abs(dy)) > 0) {
                const a = Math.atan2(dy, dx) + Math.PI;
                const d = Math.round(Math.sqrt(dx * dx + dy * dy));
                this.g.save();
                this.g.translate(this.lx, this.ly);
                this.g.rotate(a);
                this.g.translate(-0.5 * this.finger.width * this.fingerScale, -0.5 * this.finger.height * this.fingerScale);
                for (let i = 0; i <= d; ++i) {
                    this.g.drawImage(this.finger,
                        0, 0, this.finger.width, this.finger.height,
                        i, 0, this.finger.width * this.fingerScale, this.finger.height * this.fingerScale);
                }
                this.g.restore();
                this.dispatchEvent(this.updateEvt);
            }
        }

        this.lx = this.x;
        this.ly = this.y;
    }

    checkPointer(id: number | string, x: number, y: number, type: string) {
        const action = actionTypes.get(type) || type;
        if (this.pointerId === null) {
            if (action === "down") {
                this.pointerId = id;
                this.lx = this.x = x;
                this.ly = this.y = y;
                this.update();
            }
        }
        else if (id === this.pointerId) {
            this.x = x;
            this.y = y;
            this.update();

            if (action === "up") {
                this.pointerId = null;
            }
        }
    }

    checkPointerUV(id: number | string, x: number, y: number, type: string) {
        this.checkPointer(id, x * this.element.width, y * this.element.height, type);
    }
}