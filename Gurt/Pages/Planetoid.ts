import { vec2 } from 'gl-matrix';
import { IDrawable, IGravitatable } from './interfaces';

export class Planetoid implements IDrawable, IGravitatable {

    public readonly gravity = vec2.create();
    public readonly velocity = vec2.create();
    public readonly position = vec2.create();

    constructor(public readonly mass: number, private readonly radius: number, private readonly atmoRadius: number) {
        if(this.atmoRadius > 0) {
            this.atmoRadius += this.radius;
        }
    }

    update(dt: number) {
        vec2.scaleAndAdd(this.velocity, this.velocity, this.gravity, dt);
        vec2.scaleAndAdd(this.position, this.position, this.velocity, dt);
    }

    draw(g: CanvasRenderingContext2D) {
        g.save();

        g.strokeStyle = "white";
        g.fillStyle = "black";
        g.lineWidth = 10;
        this.drawMajor(g, 1);
        g.stroke();

        if(this.atmoRadius > 0) {
            g.lineWidth = 0.5;
            g.beginPath();
            g.arc(this.position[0], this.position[1], this.atmoRadius, 0, 2 * Math.PI);
            g.stroke();
        }

        g.restore();
    }


    private drawMajor(g: CanvasRenderingContext2D, scale: number) {
        g.beginPath();
        g.arc(this.position[0], this.position[1], this.radius * scale, 0, 2 * Math.PI);
        g.fill();
    }

    drawMini(g: CanvasRenderingContext2D): void {
        g.save();
        g.fillStyle = "white";
        this.drawMajor(g, 50);
        g.restore();
    }
}
