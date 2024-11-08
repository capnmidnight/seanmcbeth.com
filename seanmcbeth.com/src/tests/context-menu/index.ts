import { backgroundColor, border, color, margin, padding, width } from "@juniper-lib/dom/dist/css";
import { onContextMenu } from "@juniper-lib/dom/dist/evts";
import { Div, HtmlRender, HR, Span } from "@juniper-lib/dom/dist/tags";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { ContextMenu } from "@juniper-lib/widgets/dist/ContextMenu";

type Options =
    | "red"
    | "green"
    | "blue"
    | "cancel";

const displayValues = new Map<Options, string>([
    ["red", "Red Color"],
    ["green", "Green Color"],
    ["blue", "Blue Color"],
    ["cancel", "Cancel Selection"]
]);

const menu = new ContextMenu();

const target = Div(
    padding("3em"),
    margin("auto", "3em"),
    width("max-content"),
    backgroundColor("yellow"),
    border("solid 1px black"),

    Span(
        color("white"),
        "Right-click Me!"
    ),

    onContextMenu(async (evt) => {
        evt.preventDefault();
        target.style.backgroundColor = "grey";

        const selection = await menu.show(
            displayValues,
            "red",
            "green",
            "blue",
            HR(),
            "cancel"
        );

        if (!isDefined(selection)) {
            target.style.backgroundColor = "yellow";
        }
        else if (selection === "cancel") {
            target.style.backgroundColor = "orange";
        }
        else {
            target.style.backgroundColor = selection;
        }
    })
);

HtmlRender("main", menu, target);