import { createNoise2D } from 'simplex-noise';
import { IDrawable, IPositionable } from './interfaces';

const S = 10;

export class Starfield implements IDrawable {

    private readonly noise = createNoise2D(Math.random);

    constructor(private readonly target: IPositionable) {

    }

    draw(g: CanvasRenderingContext2D) {
        g.save();
        g.fillStyle = "white";
        for (let dy = 0; dy < g.canvas.height; dy += S) {
            const y = dy - S * Math.round(this.target.position[1] / S);
            for (let dx = 0; dx < g.canvas.width; dx += S) {
                const x = dx - S * Math.round(this.target.position[0] / S);
                const v = this.noise(S * x, S * y);

                if (v > 0.9) {
                    g.fillRect(x, y, 2, 2);
                }
            }
        }
        g.restore();
    }

    drawMini(_: CanvasRenderingContext2D): void {
        // do nothing
    }
}
