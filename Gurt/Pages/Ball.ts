import { arrayRandom } from "@juniper-lib/collections/src/arrays";
import { Vec2 } from "gl-matrix/dist/esm";
import { randomRange } from "@juniper-lib/tslib/dist/math";

const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "magenta",
    "cyan"
];

export class Ball {

    #pos: Vec2;
    get pos() { return this.#pos; }

    #vel: Vec2;
    get vel() { return this.#vel; }

    #color: string;

    static BYTE_LENGTH = 2 * Vec2.BYTE_LENGTH;

    constructor(floats: Float32Array) {
        this.#pos = new Vec2(floats, 0);
        this.#vel = new Vec2(floats, Vec2.BYTE_LENGTH);
        this.#color = arrayRandom(colors);
    }

    static fill(outputArray: Ball[]): ArrayBuffer {
        const buffer = new ArrayBuffer(Ball.BYTE_LENGTH * outputArray.length);
        for (let i = 0; i < outputArray.length; ++i) {
            const floats = new Float32Array(buffer, Ball.BYTE_LENGTH * i, 4);
            const ball = outputArray[i] = new Ball(floats);
            ball.pos.x = randomRange(-1, 1);
            ball.pos.y = randomRange(-1, 1);
            ball.vel.x = randomRange(-.1, .1)
            ball.vel.y = randomRange(-.1, .1);

        }

        return buffer;
    }

    draw2d(g: CanvasRenderingContext2D, s: number, sh: number) {
        const heading = Math.atan2(this.vel.y, this.vel.x);
        const speed = this.vel.magnitude;

        g.save();
        g.fillStyle = this.#color;
        g.translate(this.#pos.x, this.#pos.y);
        g.rotate(heading);
        g.scale(1 + speed, 1);
        g.fillRect(-sh, -sh, s, s);
        g.restore();
    }
}
