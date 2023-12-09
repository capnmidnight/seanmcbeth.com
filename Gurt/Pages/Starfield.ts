import { createNoise2D } from 'simplex-noise';
import { IDrawable, IPositionable } from './interfaces';

const step = 10;

export class Starfield implements IDrawable {

    private readonly noise = createNoise2D(Math.random);

    constructor(private readonly target: IPositionable) {

    }

    draw(g: CanvasRenderingContext2D, scale: number) {
        g.save();
        g.fillStyle = "white";
        const ddx = 0.5 * g.canvas.width;
        const ddy = 0.5 * g.canvas.height;
        for (let dy = -ddy; dy < ddy; dy += step) {
            const y = dy - step * Math.round(this.target.position[1] / step);
            for (let dx = -ddx; dx < ddx; dx += step) {
                const x = dx - step * Math.round(this.target.position[0] / step);
                const v = this.noise(step * x, step * y);

                if (v > 0.9) {
                    g.fillRect(x, y, 2 / scale, 2 / scale);
                }
            }
        }
        g.restore();
    }

    drawMini(_: CanvasRenderingContext2D, _scale: number): void {
        // do nothing
    }
}
