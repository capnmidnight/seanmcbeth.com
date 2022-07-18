﻿import { TypedEvent, TypedEventBase, xy2i } from "@juniper-lib/tslib";

import { singleton } from "@juniper-lib/tslib";

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

export interface DirtEventMap {
    "update": TypedEvent<"update">;
}

export interface IDirtService extends TypedEventBase<DirtEventMap> {
    checkPointer(id: number | string, x: number, y: number, type: string): void;
    checkPointerUV(id: number | string, x: number, y: number, type: string): void;
}

export class DirtService extends TypedEventBase<DirtEventMap> implements IDirtService {
    private readonly sub: OffscreenCanvas;
    private readonly subg: OffscreenCanvasRenderingContext2D;
    private readonly updateEvt = new TypedEvent("update");

    private canvas: OffscreenCanvas = null;
    private g: OffscreenCanvasRenderingContext2D = null;
    private pointerId: number | string = null;
    private fr: number = null;
    private pr: number = null;
    private height: number = null;
    private x: number = null;
    private y: number = null;
    private lx: number = null;
    private ly: number = null;

    constructor() {
        super();

        this.sub = new OffscreenCanvas(this.height, this.height);
        this.subg = this.sub.getContext("2d");
    }

    init(canvas: OffscreenCanvas, fr: number, pr: number): Promise<void> {
        this.canvas = canvas;
        this.g = this.canvas.getContext("2d");
        this.g.fillStyle = "rgb(50%, 50%, 50%)";
        this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const imgData = this.g.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const { data, width, height } = imgData;
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
        return Promise.resolve();
    }

    private update() {
        if (this.pointerId !== null && this.canvas) {
            const dx = this.lx - this.x;
            const dy = this.ly - this.y;
            if ((Math.abs(dx) + Math.abs(dy)) > 0) {
                const a = Math.atan2(dy, dx) + Math.PI;
                const d = Math.round(Math.sqrt(dx * dx + dy * dy));
                const width = d + this.fr + this.pr;
                this.sub.width = width;
                this.sub.height = this.height;
                this.subg.save();
                this.subg.translate(0, this.fr + this.pr);
                this.subg.rotate(-a);
                this.subg.translate(-this.lx, -this.ly);
                this.subg.drawImage(this.canvas, 0, 0);
                this.subg.restore();

                const imgData = this.subg.getImageData(0, 0, this.sub.width, this.sub.height);

                const { data } = imgData;
                const components = data.length / (width * this.height);

                const I = (x: number, y: number) => xy2i(x, y + this.fr + this.pr, width, components);
                const GET = (x: number, y: number) => data[I(x, y)] / 255;
                const SET = (x: number, y: number, v: number) => data[I(x, y)] = 255 * v;

                const start = GET(0, 0);
                const level = Math.max(0, start - 0.25);

                let accum = 0;
                for (let x = 0; x < d; ++x) {
                    const here = GET(x, 0);
                    accum += here - level
                    SET(x, 0, level);
                    for (let y = -this.fr; y <= this.fr; ++y) {
                        const dx = this.fr - Math.abs(y);
                        const here = GET(x + dx, y);
                        accum += here - level;
                        SET(x + dx, y, level);
                    }

                    const deposit = level / (2 * this.fr * this.pr);
                    for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
                        if (y < -this.fr || this.fr < y) {
                            const dx = this.fr - Math.abs(y);
                            const there = GET(x + dx, y);
                            const v = Math.min(accum, deposit);
                            SET(x + dx, y, there + v);
                            accum -= v;
                        }
                    }
                }

                if (accum > 0) {
                    const deposit = accum / (2 * this.fr * this.pr);
                    for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
                        if (y < -this.fr || this.fr < y) {
                            const dx = this.fr - Math.abs(y);
                            const there = GET(d + dx, y);
                            const v = Math.min(accum, deposit);
                            SET(d + dx, y, there + v);
                            accum -= v;
                        }
                    }
                }

                

                // normalize green and blue channels
                for (let i = 0; i < data.length; i += components) {
                    const p = data[i];
                    data[i + 1] = p;
                    data[i + 2] = p;
                }

                this.subg.putImageData(imgData, 0, 0);

                this.g.save();
                this.g.translate(this.lx, this.ly);
                this.g.rotate(a);
                this.g.translate(-0, -this.fr - this.pr);
                this.g.drawImage(this.sub, 0, 0);
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
        this.checkPointer(id, x * this.canvas.width, y * this.canvas.height, type);
    }
}