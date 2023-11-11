import { vec2 } from "gl-matrix";
import { IDrawable, IMovable, IPositionable } from './interfaces';

export class Camera implements IDrawable, IPositionable {

    public readonly position = vec2.create();

    constructor(private readonly canvas: HTMLCanvasElement, private readonly target: IPositionable & IMovable) {
    }

    update(_: number): void {
        vec2.set(this.position, this.canvas.width, this.canvas.height);
        vec2.scale(this.position, this.position, 0.5);
        vec2.scaleAndAdd(this.position, this.position, this.target.position, -1);
        const speed = vec2.len(this.target.velocity);
        if (speed > 0) {
            vec2.scaleAndAdd(this.position, this.position, this.target.velocity, -1 / Math.pow(speed, .25));
        }
    }

    draw(g: CanvasRenderingContext2D) {
        g.fillStyle = "rgba(0, 0, 0, 0.5)";
        g.fillRect(0, 0, this.canvas.width, this.canvas.height);
        g.translate(this.position[0], this.position[1]);
    }
}
