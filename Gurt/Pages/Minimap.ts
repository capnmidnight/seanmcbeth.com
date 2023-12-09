import { Height, Width } from "@juniper-lib/dom/src/attrs";
import { Canvas } from "@juniper-lib/dom/src/tags";
import { IDrawable } from "./interfaces";
import { Camera } from "./Camera";

export class Minimap {

    private readonly buffer = Canvas(Width(256), Height(128));
    private readonly g = this.buffer.getContext("2d");

    constructor(private readonly scale: number, private readonly camera: Camera, private readonly drawables: IDrawable[]) {
    }

    draw(g: CanvasRenderingContext2D) {
        this.g.save();

        this.camera.prepare(this.g, this.scale);
        g.scale(this.scale, this.scale);

        for (const drawable of this.drawables) {
            drawable.drawMini(this.g, this.scale);
        }

        this.g.restore();

        g.save();

        g.strokeStyle = "rgba(255, 255, 255, 0.25)";
        g.lineWidth = 1;
        g.translate(10, 10);
        g.drawImage(this.buffer, 0, 0);
        g.strokeRect(0, 0, this.buffer.width, this.buffer.height);

        g.restore();
    }
}
