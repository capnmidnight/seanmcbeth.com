import { vec2 } from "gl-matrix";
import { Keyboard } from "./Keyboard";
import { zero } from "./constants";
import { IDrawable, IGravitatable } from "./interfaces";

const R = 5;
const F = 1000;
const D = -0.05;

export class Ship implements IDrawable, IGravitatable {
    public enginePower = 0;
    public turnRate = 0;
    public drag = 0;
    public mass = 1;
    private rotation = 0;
    private readonly shake = vec2.create();
    private readonly acceleration = vec2.create();
    public readonly gravity = vec2.create();
    public readonly velocity = vec2.create();
    public readonly position = vec2.create();

    constructor(private readonly keyboard: Keyboard) {

    }

    update(dt: number) {
        this.turnRate = this.keyboard.horizontal;
        this.enginePower = Math.max(-0.5, this.keyboard.vertical) + this.keyboard.shift * 7;
        this.rotation += R * this.turnRate * dt;
        vec2.set(this.acceleration, 1, 0);
        vec2.rotate(this.acceleration, this.acceleration, zero, this.rotation);
        vec2.scale(this.acceleration, this.acceleration, F * this.enginePower * dt);

        vec2.set(this.shake, 0, Math.random() * 2 - 1);
        vec2.rotate(this.shake, this.shake, zero, this.rotation);
        const shudder = 0; //Math.pow(vec2.len(this.acceleration), 0.3333);
        vec2.scaleAndAdd(this.shake, zero, this.shake, shudder);

        vec2.scaleAndAdd(this.acceleration, this.acceleration, this.velocity, D * this.drag);
        vec2.add(this.acceleration, this.acceleration, this.gravity);
        vec2.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
        vec2.scaleAndAdd(this.position, this.position, this.velocity, dt);
    }

    draw(g: CanvasRenderingContext2D, scale: number) {
        g.save();
        g.fillStyle = "black";
        g.strokeStyle = "white";
        g.lineWidth = 1.25 / scale;
        g.scale(scale, scale);
        g.translate(this.position[0] + this.shake[0], this.position[1] + this.shake[1]);
        g.rotate(this.rotation);
        g.beginPath();
        g.moveTo(14, 0);
        g.lineTo(-8, 10);
        g.lineTo(-4, 0);
        if (this.enginePower > 0) {
            const ep = -8 * Math.sqrt(this.enginePower);
            g.lineTo(ep - 3.2 * Math.random(), 1.6 + 3.2 * Math.random());
            g.lineTo(-5.6 + 0.8 * Math.random(), 0 + 0.8 * Math.random());
            g.lineTo(ep - 3.2 * Math.random(), -1.6 - 3.2 * Math.random());
            g.lineTo(-4, 0);
        }
        g.lineTo(-8, -10);
        g.closePath();
        g.stroke();
        g.restore();
    }

    drawMini(g: CanvasRenderingContext2D, scale: number): void {
        const s = 4 / scale;
        g.save();
        g.fillStyle = "yellow";
        g.fillRect(this.position[0], this.position[1], s, s);
        g.restore();
    }
}
