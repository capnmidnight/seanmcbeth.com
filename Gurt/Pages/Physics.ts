import { vec2 } from 'gl-matrix';
import { zero } from './constants';
import { IGravitatable, IUpdatable } from './interfaces';

const G = 1; // 6.6743015e-11;
const delta = vec2.create();

export class Physics implements IUpdatable {

    private readonly bodies: IGravitatable[];

    constructor(...bodies: IGravitatable[]) {
        this.bodies = bodies;
    }

    update(_: number) {
        for (const body of this.bodies) {
            vec2.copy(body.gravity, zero);
        }

        for (let i = 0; i < this.bodies.length - 1; ++i) {
            const a = this.bodies[i];
            for (let j = i + 1; j < this.bodies.length; ++j) {
                const b = this.bodies[j];
                vec2.sub(delta, a.position, b.position);
                const rSquared = vec2.sqrLen(delta);
                if (rSquared > 0) {
                    vec2.normalize(delta, delta);
                    const F = G * a.mass * b.mass / rSquared;
                    vec2.scaleAndAdd(a.gravity, a.gravity, delta, -F / a.mass);
                    vec2.scaleAndAdd(b.gravity, b.gravity, delta, F / b.mass);
                }
            }
        }
    }
}
