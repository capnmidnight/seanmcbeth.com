import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import "./index.css";

const frontBuffer = document.querySelector<HTMLCanvasElement>("#frontBuffer");

const resizer = new ResizeObserver(() => {
    frontBuffer.width = Math.floor(frontBuffer.clientWidth * devicePixelRatio);
    frontBuffer.height = Math.floor(frontBuffer.clientHeight * devicePixelRatio);
});

resizer.observe(frontBuffer);

console.log(BABYLON);