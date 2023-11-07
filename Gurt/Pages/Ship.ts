import { IDrawable } from "./IDrawable";
import { vec2 } from "gl-matrix";

const zero = vec2.create();
const drag = 0.1;

export class Ship implements IDrawable {
    public force = 0;
    public turnRate = 0;
    private rotation = 0;
    private readonly thrust = vec2.create();
    private readonly velocity = vec2.create();
    private readonly displacement = vec2.create();


    update(dt: number) {
        this.rotation += dt * this.turnRate * 0.005;
        vec2.set(this.thrust, 1, 0);
        vec2.rotate(this.thrust, this.thrust, zero, this.rotation);
        vec2.scale(this.thrust, this.thrust, this.force * dt * 0.00005);

        vec2.scaleAndAdd(this.thrust, this.thrust, this.velocity, -drag * dt * 0.001);
        vec2.scaleAndAdd(this.velocity, this.velocity, this.thrust, dt);
        vec2.scaleAndAdd(this.displacement, this.displacement, this.velocity, dt);
    }

    draw(g: CanvasRenderingContext2D) {
        g.save();
        g.fillStyle = "black";
        g.strokeStyle = "white";
        g.lineWidth = 0.3;
        g.translate(this.displacement[0], this.displacement[1]);
        g.rotate(this.rotation);
        g.scale(5, 5);
        g.beginPath();
        g.moveTo(1, 0);
        g.lineTo(-1, 1);
        g.lineTo(-0.5, 0);
        g.lineTo(-1, -1);
        g.closePath();
        g.stroke();
        g.restore();
    }
}
