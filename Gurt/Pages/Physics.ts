import { vec2 } from 'gl-matrix';
import { zero } from './constants';
import { IGravitatable, IUpdatable } from './interfaces';

const G = 6.6743015e-11;
const delta = vec2.create();
const timeStep = 0.01;

export class Physics implements IUpdatable {

    private readonly bodies: IGravitatable[];
    private timeAccum = 0;

    constructor(...bodies: IGravitatable[]) {
        this.bodies = bodies;
    }

    update(dt: number) {

        for (this.timeAccum += dt; this.timeAccum > 0; this.timeAccum -= timeStep) {

            for (const body of this.bodies) {
                vec2.copy(body.gravity, zero);
            }

            for (let i = 0; i < this.bodies.length - 1; ++i) {
                const a = this.bodies[i];
                if (a.mass !== 0) {
                    for (let j = i + 1; j < this.bodies.length; ++j) {
                        const b = this.bodies[j];
                        if (b.mass !== 0) {
                            vec2.sub(delta, a.position, b.position);
                            
                            const rSquared = delta.squaredMagnitude;
                            if (rSquared > 0) {
                                delta.normalize();
                                const F = G * a.mass * b.mass / rSquared;
                                a.gravity.scaleAndAdd(delta, -F / a.mass);
                                b.gravity.scaleAndAdd(delta, F / b.mass);
                            }
                        }
                    }
                }
            }

            for (const body of this.bodies) {
                body.update(timeStep);
            }
        }
    }
}
