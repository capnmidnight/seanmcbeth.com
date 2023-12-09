import { vec2 } from "gl-matrix";

export interface IUpdatable {
    update(dt: number): void;
}

export interface IDrawable {
    draw(g: CanvasRenderingContext2D, scale: number): void;
    drawMini(g: CanvasRenderingContext2D, scale: number): void;
}

export interface IPositionable {
    position: vec2;
}

export interface IMovable extends IPositionable, IUpdatable {
    velocity: vec2;
}

export interface IGravitatable extends IMovable {
    mass: number;
    gravity: vec2;
}