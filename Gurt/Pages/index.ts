import { ID } from "@juniper-lib/dom/src/attrs";
import { Canvas } from "@juniper-lib/dom/src/tags";
import { vec2 } from "gl-matrix";
import { Camera } from "./Camera";
import { Keyboard } from "./Keyboard";
import { Physics } from "./Physics";
import { Planetoid } from "./Planetoid";
import { Ship } from "./Ship";
import { Starfield } from "./Starfield";
import "./index.css";
import { IDrawable, IUpdatable } from './interfaces';
import { registerResizer } from "./registerResizer";
import { runAnimation } from "./runAnimation";

const canvas = Canvas(ID("frontBuffer"));
const g = canvas.getContext("2d");
const keyboard = new Keyboard();
const ship = new Ship(keyboard);
const blackhole = new Planetoid(1e7, 10, 0);
const planet = new Planetoid(1e6, 50, 50);
const camera = new Camera(canvas, ship)
const starfield = new Starfield(canvas, camera);
const physics = new Physics(blackhole, planet, ship);
const updatables: IUpdatable[] = [physics, blackhole, planet, ship, camera];
const drawables: IDrawable[] = [camera, starfield, blackhole, planet, ship];

vec2.set(blackhole.position, 500, 100);
vec2.set(planet.position, -500, -150);
vec2.set(planet.velocity, 30, -30);

registerResizer(canvas);

runAnimation(dt => {
    g.save();

    for (const updatable of updatables) {
        updatable.update(dt);
    }

    for (const drawable of drawables) {
        drawable.draw(g);
    }

    g.restore();
});