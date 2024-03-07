const DT = 0;
const LIMIT = 1;
const ATTRACT = 2;
const REPEL = 3;
const GRAV = 4;
const K0 = 5;
const K1 = 6;
const K2 = 7;

export class Uniforms extends Float32Array {
    constructor() {
        super(8);
    }

    get dt() { return this[DT]; }
    set dt(v) { this[DT] = v; }

    get limit() { return this[LIMIT]; }
    set limit(v) { this[LIMIT] = v; }

    get attract() { return this[ATTRACT]; }
    set attract(v) { this[ATTRACT] = v; }

    get repel() { return this[REPEL]; }
    set repel(v) { this[REPEL] = v; }

    get grav() { return this[GRAV]; }
    set grav(v) { this[GRAV] = v; }

    get k0() { return this[K0]; }
    set k0(v) { this[K0] = v; }

    get k1() { return this[K1]; }
    set k1(v) { this[K1] = v; }

    get k2() { return this[K2]; }
    set k2(v) { this[K2] = v; }
}