import { vec2 } from "gl-matrix";
import { IMovable, IPositionable } from './interfaces';

export class Camera implements IPositionable {

    public readonly position = vec2.create();

    constructor(private readonly target: IPositionable & IMovable) {
    }

    predict(g: CanvasRenderingContext2D) {
        g.fillStyle = "rgba(0, 0, 0, 0.5)";
        g.fillRect(0, 0, g.canvas.width, g.canvas.height);

        vec2.set(this.position, g.canvas.width, g.canvas.height);
        vec2.scale(this.position, this.position, 0.5);
        vec2.scaleAndAdd(this.position, this.position, this.target.position, -1);
        const speed = vec2.len(this.target.velocity);
        if (speed > 0) {
            vec2.scaleAndAdd(this.position, this.position, this.target.velocity, -1 / Math.pow(speed, .25));
        }
        g.translate(this.position[0], this.position[1]);
    }

    prepare(g: CanvasRenderingContext2D, scale: number) {
        g.clearRect(0, 0, g.canvas.width, g.canvas.height);
        g.fillStyle = "rgba(0, 0, 0, 0.75)";
        g.fillRect(0, 0, g.canvas.width, g.canvas.height);
    
        vec2.set(this.position, g.canvas.width, g.canvas.height);
        vec2.scale(this.position, this.position, 0.5);
        vec2.scaleAndAdd(this.position, this.position, this.target.position, -scale);
        g.translate(this.position[0], this.position[1]);
        g.scale(scale, scale);
    }
}
