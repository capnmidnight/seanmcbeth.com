import { ID } from "@juniper-lib/dom/src/attrs";
import { Canvas } from "@juniper-lib/dom/src/tags";
import { vec2 } from "gl-matrix";
import { Camera } from "./Camera";
import { Keyboard } from "./Keyboard";
import { Minimap } from "./Minimap";
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
const camera = new Camera(ship);
const sun = new Planetoid("Sol", 2e30, 6.957e5, 0, "yellow");
const earth = new Planetoid("Terra", 6e24, 6.371e3, 335, "blue");
const starfield = new Starfield(camera);
const physics = new Physics(sun, earth, ship);
const updatables: IUpdatable[] = [physics];
const drawables: IDrawable[] = [starfield, sun, earth, ship];
const minimap = new Minimap(1e-5, camera, drawables);
const scale = 1e-6;

vec2.set(sun.position, -1.5e11, 0);
vec2.set(earth.velocity, 0, 30);
vec2.set(ship.position, 4.2e4, 0);

registerResizer(canvas);

runAnimation(dt => {

    for (const updatable of updatables) {
        updatable.update(dt);
    }

    g.save();

    camera.predict(g, scale);
    for (const drawable of drawables) {
        drawable.draw(g, scale);
    }

    g.restore();

    minimap.draw(g);
});