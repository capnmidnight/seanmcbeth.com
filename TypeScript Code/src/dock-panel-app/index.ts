import { classList, draggable, id } from "@juniper-lib/dom/attrs";
import { backgroundColor, border, cursor, display, float, gridGap, gridTemplate, gridTemplateColumns, gridTemplateRows, height, opacity, padding, rule, width } from "@juniper-lib/dom/css";
import { onClick, onDragEnd, onDragOver, onDragStart } from "@juniper-lib/dom/evts";
import { ButtonSmall, Div, elementApply, ElementChild, elementInsertBefore, elementIsDisplayed, elementSetText, elementToggleDisplay, H3, Style } from "@juniper-lib/dom/tags";
import { blackMediumDownPointingTriangleCentered as closeIcon, blackMediumRightPointingTriangleCentered as openIcon } from "@juniper-lib/emoji";
import { arrayInsertAt } from "@juniper-lib/tslib/collections/arrays";
import { and } from "@juniper-lib/tslib/identity";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { vec2 } from "gl-matrix";

Style(
    rule(".dock.panel",
        display("grid"),
        gridTemplate("auto/auto"),
        width("100%"),
        height("100%")
    ),
    rule(".dock.row, .dock.column",
        display("grid"),
        gridGap("2px")
    ),
    rule(".dock.cell",
        padding("5px"),
        border("1px solid black")
    ),
    rule(".dock.cell[draggable]",
        cursor("grab")
    ),
    rule(".dock.cell[draggable].dragging",
        opacity(.5)
    ),
    rule(".dock.row > .dock.sep[draggable]",
        cursor("ew-resize")
    ),
    rule(".dock.column > .dock.sep[draggable]",
        cursor("ns-resize")
    ),
    rule(".dock.sep",
        padding("2px")
    ),
    rule(".dock.sep.targeting",
        backgroundColor("lightgrey")
    )
);

const SIZE_KEY = "proportion";

type DockType = "cell" | "row" | "column" | "sep" | "panel";

function isDockType(type: DockType, v: Element) {
    return isDefined(v) && v.classList.contains(type);
}

function isPanel(v: Element): boolean {
    return isDockType("panel", v);
}

function isSep(v: Element): boolean {
    return isDockType("sep", v);
}

function isReal(v: Element): boolean {
    return isDefined(v)
        && !isSep(v);
}

function isCell(v: Element): boolean {
    return isDockType("cell", v);
}

function isRow(v: Element): boolean {
    return isDockType("row", v);
}

function isColumn(v: Element): boolean {
    return isDockType("column", v);
}

function isGroup(v: Element): boolean {
    return isRow(v)
        || isColumn(v);
}

function getDockCount(v: Element): number {
    if (isNullOrUndefined(v)) {
        return null;
    }

    return Array.from(v.children)
        .filter(isReal)
        .length;
}

function isEmpty(v: Element): boolean {
    return getDockCount(v) === 0;
}

function isLonely(v: Element): boolean {
    return getDockCount(v) === 1;
}

function isClosed(v: Element): boolean {
    return isCell(v) && !elementIsDisplayed(v.querySelector<HTMLElement>(".content"))
        || isGroup(v) && Array.from(v.children)
            .map(isClosed)
            .reduce(and, true);
}

function cleanupPanel(parent: Element) {
    while (isDefined(parent)) {
        if (isPanel(parent)) {
            break;
        }

        let here = parent.firstElementChild;
        while (here) {
            const next = here.nextElementSibling;
            if (isSep(here) && isSep(next)) {
                next.remove();
            }
            else {
                here = next;
            }
        }

        for (let i = 0; i < parent.children.length; ++i) {
            const child = parent.children[i] as HTMLElement;
            if (isSep(child)) {
                child.draggable = 0 < i && i < parent.children.length - 1;
            }
        }

        const gParent = parent.parentElement;

        if (isEmpty(parent)) {
            parent.remove();
        }
        else if (isLonely(parent)) {
            parent.replaceWith(parent.children[1]);
        }
        else if (!isPanel(gParent) && isLonely(gParent)) {
            gParent.replaceWith(parent);
            continue;
        }

        parent = gParent;
    }
}

function regrid(v: Element) {
    const panel = getDockPanel(v);
    const groups = panel.querySelectorAll(".row, .column");
    for (const parent of groups) {
        const gridTemplate = isRow(parent)
            ? gridTemplateColumns
            : gridTemplateRows;
        const gridTemplateAlt = isRow(parent)
            ? gridTemplateRows
            : gridTemplateColumns;

        const template = gridTemplate(
            ...Array.from(parent.children)
                .map(child => child as HTMLElement)
                .map(child => {
                    if (isSep(child) || isClosed(child)) {
                        return "auto";
                    }

                    const sizeStr = child.dataset[SIZE_KEY] || "1";
                    return (sizeStr + "fr") as CSSGridFlexValue;
                })
        );

        const templateAlt = gridTemplateAlt("auto", "1fr", "auto");

        elementApply(parent,
            template,
            templateAlt);
    }
}

let counter = 0;

function Dock(type: DockType, ...rest: ElementChild[]) {
    const i = counter++;
    return Div(
        id(type + i),
        classList("dock", type),
        ...rest
    )
}

function DockPanel(...rest: ElementChild[]) {
    const panel = Dock("panel", ...rest);
    const groups = panel.querySelectorAll(".row, .column");
    for (let i = groups.length - 1; i >= 0; --i) {
        cleanupPanel(groups[i]);
    }
    regrid(panel);
    return panel;
}

function getDockPanel(v: Element) {
    while (isDefined(v) && !isPanel(v)) {
        v = v.parentElement;
    }
    return v;
}

function DockSep() {
    return Dock("sep");
}

function DockGroup(direction: "column" | "row", ...rest: ElementChild[]) {
    for (let i = rest.length - 1; i >= 0; --i) {
        if (rest[i] instanceof Element) {
            arrayInsertAt(rest, DockSep(), i);
        }
    }
    rest.push(DockSep())
    return Dock(direction, ...rest);
}

function DockCol(...rest: ElementChild[]) {
    return DockGroup("row", ...rest);
}

function DockRow(...rest: ElementChild[]) {
    return DockGroup("column", ...rest);
}

function DockCell(...rest: ElementChild[]) {
    const content = Div(
        classList("content"),
        ...rest
    );
    const closer = ButtonSmall(
        float("left"),
        closeIcon.emojiStyle,
        onClick(() => {
            elementToggleDisplay(content);
            const isOpen = elementIsDisplayed(content);
            elementSetText(closer, isOpen ? closeIcon.emojiStyle : openIcon.emojiStyle);
            regrid(cell);
        })
    );
    const cell = Dock("cell",
        draggable(true),
        closer,
        H3("C" + counter),
        content);
    return cell;
}

let cell: Element = null;
let target: Element = null;
let sep: Element = null;
const start = vec2.create();
const end = vec2.create();
const delta = vec2.create();
elementApply(document.body,
    DockPanel(
        onDragStart((evt) => {
            target = null;
            const e = evt.target as Element;
            if (isCell(e)) {
                cell = e;
                cell.classList.toggle("dragging", true);
            }
            else if (isSep(e)) {
                sep = e;
                sep.classList.toggle("targeting", true);
                vec2.set(start, evt.clientX, evt.clientY);
            }
        }),
        onDragOver((evt) => {
            if (isDefined(sep)) {
                evt.preventDefault();
                //const left = sep.previousElementSibling as HTMLElement;
                //const right = sep.nextElementSibling as HTMLElement;
                //const leftSizeStr = left.dataset[SIZE_KEY] || "1";
                //const rightSizeStr = right.dataset[SIZE_KEY] || "1";
                //let leftSize = parseFloat(leftSizeStr);
                //let rightSize = parseFloat(rightSizeStr);
                vec2.set(end, evt.clientX, evt.clientY);
                vec2.sub(delta, end, start);
                //let space = 0;
                //if (isRow(sep.parentElement)) {
                //    space = left.clientWidth + right.clientWidth;
                //}
                //else {
                //    space = left.clientHeight + right.clientHeight;
                //}
                regrid(sep);
            }
            else {
                if (target) {
                    target.classList.toggle("targeting", false);
                }
                target = evt.target as Element;
                if (isSep(target)) {
                    target.classList.toggle("targeting", true);
                    evt.preventDefault();
                }
                else {
                    target = null;
                }
            }
        }),
        onDragEnd((evt) => {
            if (cell) {
                cell.classList.toggle("dragging", false);
            }
            if (target) {
                target.classList.toggle("targeting", false);
            }
            if (sep) {
                sep.classList.toggle("targeting", false);
            }
            if (evt.target === cell && target !== null) {
                const oldParent = cell.parentElement;
                const newParent = target.parentElement;
                const next = target.nextElementSibling;
                elementInsertBefore(newParent, cell, next);
                elementInsertBefore(newParent, DockSep(), next);

                cleanupPanel(newParent);
                if (oldParent !== newParent) {
                    cleanupPanel(oldParent);
                }

                regrid(cell);
            }

            cell = null;
            target = null;
            sep = null;
        }),
        DockRow(
            DockCol(
                DockCell("Lorem ipsum"),
                DockCell("Dolore sit amet")
            ),
            DockCell("Bake me pies"),
            DockCell("Bake me sweet little pies")
        )
    )
);
