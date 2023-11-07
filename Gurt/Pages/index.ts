import { Canvas } from "@juniper-lib/dom/src/tags";
import { ID } from "@juniper-lib/dom/src/attrs";
import "./index.css";
import { Ship } from "./Ship";
import { registerResizer } from "./registerResizer";
import { runAnimation } from "./runAnimation";

const frontBuffer = Canvas(ID("frontBuffer"));
registerResizer(frontBuffer);
const g = frontBuffer.getContext("2d");
const ship = new Ship();
let left = false,
    right = false,
    up = false,
    down = false;

runAnimation(dt => {
    ship.turnRate = left ? -1 : right ? 1 : 0;
    ship.force = up ? 1 : down ? 0.5 : 0;
    ship.update(dt);

    g.save();
    g.fillStyle = "rgba(0, 0, 0, 0.5)";
    g.fillRect(0, 0, frontBuffer.width, frontBuffer.height);

    g.translate(frontBuffer.width * 0.5, frontBuffer.height * 0.5);

    ship.draw(g);

    g.restore();
});

window.addEventListener("keydown", evt => {
    left = left || evt.key === "ArrowLeft";
    right = right || evt.key === "ArrowRight";
    up = up || evt.key === "ArrowUp";
    down = down || evt.key === "ArrowDown";
});

window.addEventListener("keyup", evt => {
    left = left && evt.key !== "ArrowLeft";
    right = right && evt.key !== "ArrowRight";
    up = up && evt.key !== "ArrowUp";
    down = down && evt.key !== "ArrowDown";
});