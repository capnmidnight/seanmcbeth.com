import { vec2 } from "gl-matrix";
import { IMovable, IPositionable } from './interfaces';

export class Camera implements IPositionable {

    public readonly position = vec2.create();

    constructor(private readonly target: IPositionable & IMovable) {
    }

    private do(g: CanvasRenderingContext2D, scale: number, color: string, addVelocity: boolean) {

        vec2.set(this.position, g.canvas.width, g.canvas.height);
        vec2.scale(this.position, this.position, 0.5)
        vec2.scaleAndAdd(this.position, this.position, this.target.position, -scale);
        if (addVelocity) {
            const speed = vec2.len(this.target.velocity);
            if (speed > 0) {
                vec2.scaleAndAdd(this.position, this.position, this.target.velocity, -scale / Math.pow(speed, .25));
            }
        }
        
        g.fillStyle = color;
        g.fillRect(0, 0, g.canvas.width, g.canvas.height);
        g.translate(this.position[0], this.position[1]);
    }

    predict(g: CanvasRenderingContext2D, scale: number) {
        this.do(g, scale, "rgba(0, 0, 0, 0.5)", true);
    }

    prepare(g: CanvasRenderingContext2D, scale: number) {
        g.clearRect(0, 0, g.canvas.width, g.canvas.height);
        this.do(g, scale, "rgba(0, 0, 0, 0.75)", false);
    }
}
