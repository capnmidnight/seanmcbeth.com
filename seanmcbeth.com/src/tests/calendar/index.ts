import { ColSpan } from "@juniper-lib/dom/dist/attrs";
import { display } from "@juniper-lib/dom/dist/css";
import { onBlur, onEnterKeyPressed, onFocus, onMouseOut, onMouseOver } from "@juniper-lib/dom/dist/evts";
import { HtmlRender, InputText, Span, TBody, TD, TH, THead, TR, Table, elementClearChildren, elementGetText, elementSetDisplay } from "@juniper-lib/dom/dist/tags";

import "./index.css";

function* gen<T>(n: number, action: (i: number) => T): IterableIterator<T> {
    for (let i = 0; i < n; ++i) {
        yield action(i);
    }
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const today = new Date();
const index = ((today.getDate()) % 7) - today.getDay();
const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
const rows = Math.floor((end.getDate() + 1 + Math.abs(index)) / 7) + 1;


function label(x: number, y: number): string {
    const i = y * 7 + x + index;
    const date = new Date(today.getFullYear(), today.getMonth(), i, 0, 0, 0, 0);
    if (date.getMonth() === today.getMonth()) {
        return date.getDate().toFixed(0);
    }
    else {
        return "";
    }
}

const title = Span(
    months[today.getMonth()],
    onMouseOver(() => {
        entry.value = elementGetText(title);
        elementSetDisplay(entry, true);
        elementSetDisplay(title, false);
    })
);

const entry = InputText(
    display("none"),
    onEnterKeyPressed(() => entry.blur()),
    onFocus(() => {
        entry.selectionStart = 0;
        entry.selectionEnd = entry.value.length;
    }),
    onBlur(() => {
        elementClearChildren(title);
        HtmlRender(title, entry.value);
        elementSetDisplay(entry, false);
        elementSetDisplay(title, true);
    }),
    onMouseOut(() => {
        if (document.activeElement !== entry) {
            elementSetDisplay(entry, false);
            elementSetDisplay(title, true);        
        }
    })
);

HtmlRender("main", Table(
    THead(
        TR(TH(ColSpan(7), title, entry)),
        TR(
            ...gen(7, i => TH(days[i]))
        )
    ),
    TBody(
        ...gen(rows, y => TR(
            ...gen(7, x => TD(
                label(x, y)
            ))
        ))
    )
));