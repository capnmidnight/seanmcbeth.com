import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { Tau } from "@juniper-lib/tslib/dist/math";
import { Vec2 } from "gl-matrix/dist/esm";

const colors = [
    "red", "green", "blue", "yellow", "magenta", "cyan", "grey", "white"
];

const SPEED = 0;
const DIRECTION = 1;

const PINNED = 0;
const GRABBED = 1;
const MOVING = 2;

export class Ball {

    static readonly BYTE_LENGTH =
        /* vectors */  1 * Vec2.BYTE_LENGTH
        /* fields */ + 2 * Float32Array.BYTES_PER_ELEMENT
        /* flags */ + 2 * Uint32Array.BYTES_PER_ELEMENT;

    #pos: Vec2;
    get pos() { return this.#pos; }

    #fields: Float32Array;
    get speed() { return this.#fields[SPEED]; }
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
    #connections: Float32Array;

    isConnected(j: number) {
        return this.#connections[j] > 0;
    }

    static create(count: number) {
        const balls = new Array<Ball>(count);
        const ballBytes = Ball.BYTE_LENGTH * count;
        const ballData = new Uint8Array(ballBytes);

        const connectionData = new Float32Array(count * count);

        for (let n = 0; n < count; ++n) {
            balls[n] = Ball.#createOne(ballData.buffer, connectionData.buffer, n, count);
        }

        return {
            balls,
            ballData,
            connectionData
        }
    }

    static #createOne(storage: ArrayBuffer, connectionData: ArrayBuffer, n: number, count: number) {
        const color = arrayRandom(colors);
        const ball = new Ball(storage, connectionData, n, count, color);

        return ball;
    }

    constructor(storage: ArrayBuffer, connectionData: ArrayBuffer, n: number, count: number, color: string) {
        let offset = n * Ball.BYTE_LENGTH;
        this.#pos = new Vec2(storage, offset);
        offset += this.#pos.byteLength;

        this.#fields = new Float32Array(storage, offset, 2);
        offset += this.#fields.byteLength;

        this.#flags = new Uint32Array(storage, offset, 1);
        offset += this.#flags.byteLength;

        this.#color = color;
        this.#connections = new Float32Array(connectionData, n * count * Float32Array.BYTES_PER_ELEMENT, count);
    }

    draw(g: CanvasRenderingContext2D) {
        g.save();
        g.fillStyle = this.#color;
        g.translate(
            this.#pos.x,
            this.#pos.y
        );
        g.rotate(this.direction);
        g.scale(1 + 0.1 * this.speed, 1);
        g.beginPath();
        g.arc(0, 0, 10, 0, Tau, false);
        g.closePath();
        g.fill();
        g.restore();
    }
}