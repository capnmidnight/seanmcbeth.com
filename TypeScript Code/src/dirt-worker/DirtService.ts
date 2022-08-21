import { setContextSize } from "@juniper-lib/dom/canvas";
import { TypedEvent, TypedEventBase } from "@juniper-lib/tslib/events/EventBase";
import { xy2i } from "@juniper-lib/tslib/math/xy2i";
import { singleton } from "@juniper-lib/tslib/singleton";

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

export class DirtServiceUpdateEvent extends TypedEvent<"update">{
    imgBmp: ImageBitmap;

    constructor() {
        super("update");
    }
}

export interface DirtEventMap {
    "update": DirtServiceUpdateEvent;
}

export interface IDirtService extends TypedEventBase<DirtEventMap> {
    checkPointer(id: number | string, x: number, y: number, type: string): void;
    checkPointerUV(id: number | string, x: number, y: number, type: string): void;
}

export class DirtService
    extends TypedEventBase<DirtEventMap>
    implements IDirtService {
    private readonly sub: OffscreenCanvas;
    private readonly subg: OffscreenCanvasRenderingContext2D;
    private readonly updateEvt = new DirtServiceUpdateEvent();

    private canvas: OffscreenCanvas = null;
    private transferCanvas: OffscreenCanvas = null;
    private g: OffscreenCanvasRenderingContext2D = null;
    private tg: OffscreenCanvasRenderingContext2D = null;
    private pointerId: number | string = null;
    private fr: number = null;
    private pr: number = null;
    private height: number = null;
    private x: number = null;
    private y: number = null;
    private lx: number = null;
    private ly: number = null;

    private components: number = null;
    private data: Uint8ClampedArray = null;

    constructor() {
        super();

        this.sub = new OffscreenCanvas(this.height, this.height);
        this.subg = this.sub.getContext("2d", {
            alpha: false,
            desynchronized: true,
            willReadFrequently: true
        });
    }

    init(width: number, height: number, fr: number, pr: number): Promise<void> {
        this.transferCanvas = new OffscreenCanvas(width, height);
        this.tg = this.transferCanvas.getContext("2d");
        this.canvas = new OffscreenCanvas(width, height);
        this.g = this.canvas.getContext("2d", {
            alpha: false,
            desynchronized: true
        });
        this.g.fillStyle = "rgb(50%, 50%, 50%)";
        this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const imgData = this.g.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const { data } = imgData;
        const components = data.length / (width * height);
        for (let i = 0; i < data.length; i += components) {
            const v = Math.floor(50 * (Math.random() - 0.5));
            for (let c = 0; c < components - 1; ++c) {
                data[i + c] += v;
            }
        }

        this.g.putImageData(imgData, 0, 0);

        this.fr = fr;
        this.pr = pr;
        this.height = 2 * (this.fr + this.pr) + 1;

        this.onUpdate();

        return Promise.resolve();
    }

    private onUpdate() {
        this.tg.drawImage(this.canvas, 0, 0);
        this.updateEvt.imgBmp = this.transferCanvas.transferToImageBitmap();
        this.dispatchEvent(this.updateEvt);
    }

    private I(x: number, y: number) {
        return xy2i(x, y + this.fr + this.pr, this.sub.width, this.components);
    }

    private GET(x: number, y: number) {
        return this.data[this.I(x, y)] / 255;
    }

    private SET(x: number, y: number, v: number) {
        return this.data[this.I(x, y)] = 255 * v;
    }

    private update() {
        if (this.pointerId !== null && this.canvas) {
            const dx = this.lx - this.x;
            const dy = this.ly - this.y;
            if ((Math.abs(dx) + Math.abs(dy)) > 0) {
                const a = Math.atan2(dy, dx) + Math.PI;
                const d = Math.round(Math.sqrt(dx * dx + dy * dy));

                setContextSize(this.subg, d + this.fr + this.pr, this.height);
                this.subg.save();
                this.subg.translate(0, this.fr + this.pr);
                this.subg.rotate(-a);
                this.subg.translate(-this.lx, -this.ly);
                this.subg.drawImage(this.canvas, 0, 0);
                this.subg.restore();

                const imgData = this.subg.getImageData(0, 0, this.sub.width, this.sub.height);
                this.data = imgData.data;
                this.components = this.data.length / (this.sub.width * this.height);

                const start = this.GET(0, 0);
                const level = Math.max(0, start - 0.25);

                let accum = 0;
                for (let x = 0; x < d; ++x) {
                    const here = this.GET(x, 0);
                    accum += here - level
                    this.SET(x, 0, level);
                    for (let y = -this.fr; y <= this.fr; ++y) {
                        const dx = this.fr - Math.abs(y);
                        const here = this.GET(x + dx, y);
                        accum += here - level;
                        this.SET(x + dx, y, level);
                    }

                    const deposit = level / (2 * this.fr * this.pr);
                    for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
                        if (y < -this.fr || this.fr < y) {
                            const dx = this.fr - Math.abs(y);
                            const there = this.GET(x + dx, y);
                            const v = Math.min(accum, deposit);
                            this.SET(x + dx, y, there + v);
                            accum -= v;
                        }
                    }
                }

                if (accum > 0) {
                    const deposit = accum / (2 * this.fr * this.pr);
                    for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
                        if (y < -this.fr || this.fr < y) {
                            const dx = this.fr - Math.abs(y);
                            const there = this.GET(d + dx, y);
                            const v = Math.min(accum, deposit);
                            this.SET(d + dx, y, there + v);
                            accum -= v;
                        }
                    }
                }



                // normalize green and blue channels
                for (let i = 0; i < this.data.length; i += this.components) {
                    const p = this.data[i];
                    this.data[i + 1] = p;
                    this.data[i + 2] = p;
                }

                this.subg.putImageData(imgData, 0, 0);

                this.g.save();
                this.g.translate(this.lx, this.ly);
                this.g.rotate(a);
                this.g.translate(-0, -this.fr - this.pr);
                this.g.drawImage(this.sub, 0, 0);
                this.g.restore();

                this.onUpdate();
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
        this.checkPointer(id, x * this.canvas.width, (1 - y) * this.canvas.height, type);
    }
}