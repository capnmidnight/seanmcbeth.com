import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { Tau, randomRange } from "@juniper-lib/tslib/dist/math";
import { Vec2 } from "gl-matrix/dist/esm";

const colors = [
    "red", "green", "blue", "yellow", "magenta", "cyan", "grey", "black"
];

const DIRECTION = 0;

const PINNED = 0;
const GRABBED = 1;
const MOVING = 2;

export class Ball {

    static readonly BYTE_LENGTH = 2 * Vec2.BYTE_LENGTH
        + 1 * Float32Array.BYTES_PER_ELEMENT
        + 1 * Uint32Array.BYTES_PER_ELEMENT;

    #pos: Vec2;
    get pos() { return this.#pos; }

    #vel: Vec2;
    get vel() { return this.#vel; }

    #fields: Float32Array;
    get direction() { return this.#fields[DIRECTION]; }

    #flags: Uint32Array;
    #isFlagSet(flag: number) {
        const mask = 1 << flag;
        return (this.#flags[0] & mask) !== 0;
    }

    #setFlag(flag: number, v: boolean) {
        const mask = 1 << flag;
        if (v) {
            this.#flags[0] |= mask;
        }
        else {
            this.#flags[0] &= ~mask;
        }
    }

    get pinned() { return this.#isFlagSet(PINNED); }
    set pinned(v) { this.#setFlag(PINNED, v); }

    get grabbed() { return this.#isFlagSet(GRABBED); }
    set grabbed(v) { this.#setFlag(GRABBED, v); }

    get moving() { return this.#isFlagSet(MOVING); }
    set moving(v) { this.#setFlag(MOVING, v); }

    #color: string;

    constructor(storage: ArrayBuffer, offset: number, color: string) {
        this.#pos = new Vec2(storage, offset);
        offset += Vec2.BYTE_LENGTH;

        this.#vel = new Vec2(storage, offset);
        offset += Vec2.BYTE_LENGTH;

        this.#fields = new Float32Array(storage, offset, 1);
        offset += this.#fields.byteLength;

        this.#flags = new Uint32Array(storage, offset, 1);
        offset += this.#flags.byteLength;

        this.#color = color;
    }

    static create(count: number) {
        const balls = new Array<Ball>(count);
        const ballBytes = Ball.BYTE_LENGTH * count;
        const connectionBytes = Uint32Array.BYTES_PER_ELEMENT * count * count;
        const ballStorage = new ArrayBuffer(ballBytes + connectionBytes);
        const ballData = new Uint8Array(ballStorage, 0, ballBytes);

        const connectionData = new Uint32Array(ballStorage, ballBytes, connectionBytes / Uint32Array.BYTES_PER_ELEMENT);

        for (let n = 0; n < count; ++n) {
            balls[n] = Ball.#createOne(ballStorage, n * Ball.BYTE_LENGTH);

            const connIndex = n * count;
            for (let m = 0; m < count; ++m) {
                if (m != n) {
                    connectionData[connIndex + m] = Math.random() < 0.2 ? 1 : 0;
                }
            }
        }

        return {
            balls,
            ballData,
            connectionData
        }
    }

    static #createOne(storage: ArrayBuffer, offset: number) {
        const color = arrayRandom(colors);
        const angle = Tau * Math.random();

        const ball = new Ball(storage, offset, color);
        
        ball.pos.x = randomRange(.1, .9);
        ball.pos.y = randomRange(.1, .9);
        ball.vel.x = Math.cos(angle);
        ball.vel.y = Math.sin(angle);
        ball.vel.scale(.0001 * colors.indexOf(color));
        ball.pinned = Math.random() < 0.01;

        return ball;
    }

    draw(g: CanvasRenderingContext2D, invW: number, invH: number) {
        const velSpeed = this.#vel.magnitude;
        g.save();
        g.fillStyle = this.#color;
        g.translate(
            this.#pos.x,
            this.#pos.y
        );
        g.scale(invW, invH);
        g.rotate(this.direction);
        g.scale(1 + velSpeed * 10, 1);
        g.beginPath();
        g.arc(0, 0, 10, 0, Tau, false);
        g.closePath();
        g.fill();
        g.restore();
    }
}