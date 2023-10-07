import { PriorityList } from "@juniper-lib/collections/dist/PriorityList";
import { elementSetClass, getInputs } from "@juniper-lib/dom/dist/tags";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";


const starters = new PriorityList<string, HTMLInputElement>();
const enders = new PriorityList<string, HTMLInputElement>();
const includers = new PriorityList<string, HTMLInputElement>();
const ranges = new Map<string, [number, number]>();
const inputs = getInputs("input.range-selector");
const forms = new Map<HTMLFormElement, string>();
const tableRows = new Map<string, HTMLTableRowElement[]>();
for (const input of inputs) {
    const rangeName = input.dataset.rangename;
    const list = isStart(input)
        ? starters
        : isEnd(input)
            ? enders
            : isInclude(input)
                ? includers
                : null;
    if (isDefined(list)) {
        list.add(rangeName, input);
        if (!isInclude(input)) {
            input.name = rangeName + (isStart(input) ? "start" : "end");
            input.addEventListener("input", selectInput);
            forms.set(input.form, rangeName);
            ranges.set(rangeName, [null, null]);
            let here: HTMLElement = input;
            while (isDefined(here) && here.tagName !== "TABLE") {
                here = here.parentElement;
            }
            if (isDefined(here) && here instanceof HTMLTableElement) {
                tableRows.set(rangeName, Array.from(here.querySelectorAll("tbody > tr")));
            }
        }
    }
}

for (const [form, rangeName] of forms) {
    form.addEventListener("reset", () => {
        ranges.set(rangeName, [null, null]);
        [starters, enders]
            .flatMap(v => v.get(rangeName))
            .forEach(v => v.disabled = false);
        if (tableRows.has(rangeName)) {
            tableRows.get(rangeName)
                .forEach(v => v.classList.remove("table-dark"));
        }
    });
}

function isStart(input: HTMLInputElement) {
    return input.classList.contains("range-selector-start");
}

function isEnd(input: HTMLInputElement) {
    return input.classList.contains("range-selector-end");
}

function isInclude(input: HTMLInputElement) {
    return input.classList.contains("range-selector-include");
}

function selectInput(this: HTMLInputElement) {
    const rangeName = this.dataset.rangename;
    const [list, other, inc] = (isStart(this)
        ? [starters, enders, includers]
        : [enders, starters, includers])
        .map(v => v.get(rangeName));
    const index = list.indexOf(this);
    for (let i = 0; i < other.length; ++i) {
        other[i].disabled = isStart(this) && i < index
            || isEnd(this) && i > index;
    }

    let [start, end] = ranges.get(rangeName);
    if (isStart(this)) {
        start = index;
        if (isNullOrUndefined(end)) {
            end = start;
            other[end].checked = true;
        }
    }
    else {
        end = index;
        if (isNullOrUndefined(start)) {
            start = end;
            other[start].checked = true;
        }
    }

    ranges.set(rangeName, [start, end]);

    if (isDefined(start) && isDefined(end)) {
        for (let i = 0; i < inc.length; ++i) {
            inc[i].checked = start <= i && i <= end;
        }

        if (tableRows.has(rangeName)) {
            const rows = tableRows.get(rangeName);
            for (let i = 0; i < rows.length; ++i) {
                elementSetClass(rows[i], start <= i && i <= end, "table-dark");
            }
        }
    }
}