import { Vec2 } from "gl-matrix";

function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export class Ball {

    #pos: Vec2;
    get pos() { return this.#pos; }

    #vel: Vec2;
    get vel() { return this.#vel; }

    constructor(pos: Vec2, vel: Vec2) {
        this.#pos = pos;
        this.#vel = vel;
    }

    static fill(outputArray: Ball[]): ArrayBuffer {
        const floatArray = new Float32Array(4 * outputArray.length);
        for (let i = 0; i < outputArray.length; ++i) {
            
            const pos = new Vec2(floatArray, 4 * i);
            pos.x = randomRange(-10, 10);
            pos.y = randomRange(-10, 10);

            const vel = new Vec2(floatArray, 4 * i + 2);
            vel.x = randomRange(-1, 1)
            vel.y = randomRange(-1, 1);

            outputArray[i] = new Ball(pos, vel);
        
        }

        return floatArray.buffer;
    }
}
