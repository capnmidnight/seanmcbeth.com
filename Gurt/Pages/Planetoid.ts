import { vec2 } from 'gl-matrix';
import { IDrawable, IGravitatable } from './interfaces';

export class Planetoid implements IDrawable, IGravitatable {

    public readonly gravity = vec2.create();
    public readonly velocity = vec2.create();
    public readonly position = vec2.create();

    constructor(
        private readonly name: string,
        public readonly mass: number,
        private readonly radius: number,
        private readonly atmoRadius: number,
        private readonly color: string) {
        if (this.atmoRadius > 0) {
            this.atmoRadius += this.radius;
        }
    }

    update(dt: number) {
        vec2.scaleAndAdd(this.velocity, this.velocity, this.gravity, dt);
        vec2.scaleAndAdd(this.position, this.position, this.velocity, dt);
    }

    private drawMajor(g: CanvasRenderingContext2D, scale: number, color: string) {
        g.fillStyle = color;
        g.translate(this.position[0], this.position[1]);
        if (this.radius * scale >= 2) {
            g.beginPath();
            g.arc(0, 0, this.radius, 0, 2 * Math.PI);
            g.fill();
        }
        else {
            g.fillRect(0, 0, 2 / scale, 2 / scale);
        }
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "white";
    }

    draw(g: CanvasRenderingContext2D, scale: number) {
        g.save();
        g.scale(scale, scale);

        if (this.atmoRadius > 0) {
            g.fillStyle = "rgba(255, 255, 255, .05)";
            g.lineWidth = 0.5 / scale;
            g.beginPath();
            g.arc(this.position[0], this.position[1], this.atmoRadius, 0, 2 * Math.PI);
            g.fill();
            g.stroke();
        }

        g.lineWidth = 2 / scale;
        this.drawMajor(g, scale, "black");
        const fontSize = 50/scale;
        g.font = `normal ${fontSize}px monospace`;
        g.fillText(this.name, 0, 0);

        g.strokeStyle = this.color;
        g.stroke();

        g.restore();
    }

    drawMini(g: CanvasRenderingContext2D, scale: number): void {
        g.save();
        this.drawMajor(g, scale, this.color);
        g.restore();
    }
}
