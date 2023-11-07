export interface IDrawable {
    update(dt: number): void;
    draw(g: CanvasRenderingContext2D): void;
}
