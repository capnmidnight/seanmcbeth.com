import { height, left, position, top, width } from "@juniper-lib/dom/dist/css";
import { Canvas, HtmlRender } from "@juniper-lib/dom/dist/tags";
import { JavaScript, Primrose } from "primrose/src";


const canv = Canvas(
    height("100vh"),
    width("100vw"),
    position("absolute"),
    top(0),
    left(0)
);

HtmlRender("main", canv);

const editor = new Primrose({
    element: canv,
    language: JavaScript,
    lineNumbers: true,
    wordWrap: true
});

editor.value = `const gestures = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend"
];

function onUserGesture(callback, test) {
    const realTest = test || () => true;

    const check = async (evt) => {
        if (evt.isTrusted && await realTest()) {
            for (const gesture of gestures) {
                window.removeEventListener(gesture, check);
            }

            await callback();
        }
    };

    for (const gesture of gestures) {
        window.addEventListener(gesture, check);
    }
}`;