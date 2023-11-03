import { Button, Div } from "@juniper-lib/dom/src/tags";
import "./index.css";
import { ID } from "@juniper-lib/dom/src/attrs";
import { onClick } from "@juniper-lib/dom/src/evts";

let counter = 0;
Button(
    ID("go"),
    onClick(() => {
        console.log("GO", ++counter);
        document.body.append(Div(counter.toFixed(0)));
    })
);