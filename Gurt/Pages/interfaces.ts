import { Vec2 } from "gl-matrix";

export interface IUpdatable {
    update(dt: number): void;
}

export interface IDrawable {
    draw(g: CanvasRenderingContext2D, scale: number): void;
    drawMini(g: CanvasRenderingContext2D, scale: number): void;
}

export interface IPositionable {
    position: Vec2;
}

export interface IMovable extends IPositionable, IUpdatable {
    velocity: Vec2;
}

export interface IGravitatable extends IMovable {
    mass: number;
    gravity: Vec2;
}