import { height, left, position, top, width } from "@juniper-lib/dom/css";
import { Canvas, elementApply } from "@juniper-lib/dom/tags";
import { JavaScript, Primrose } from "primrose/src";


const canv = Canvas(
    height("100vh"),
    width("100vw"),
    position("absolute"),
    top(0),
    left(0)
);

elementApply(document.body, canv);

const editor = new Primrose({
    element: canv,
    language: JavaScript,
    lineNumbers: true,
    wordWrap: true
});

editor.value = Canvas.toString();