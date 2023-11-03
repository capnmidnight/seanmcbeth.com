import { Button, Div } from "@juniper-lib/dom/src/tags";
import { ID } from "@juniper-lib/dom/src/attrs";
import { onClick } from "@juniper-lib/dom/src/evts";
import "./index.css";

let counter = 0;
Button(
    ID("go"),
    onClick(() => {
        console.log("GO", ++counter);
        document.body.append(Div(counter.toFixed(0)));
    })
);

window.addEventListener("keydown", e => {
    console.log(e);
    document.body.append(Div("Down", e.key));
});

window.addEventListener("keyup", e => {
    console.log(e);
    document.body.append(Div("Up", e.key));
});