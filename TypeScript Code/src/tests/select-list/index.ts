import { ID, Query } from "@juniper-lib/dom/attrs";
import { onInput } from "@juniper-lib/dom/evts";
import { smallAirplane, smallBlueDiamond } from "@juniper-lib/emoji";
import { WindowLogger } from "@juniper-lib/testing/WindowLogger";
import { SelectList, SelectListElement, SelectListItemSelectedEvent, DataAttr, onItemSelected } from "@juniper-lib/widgets/SelectList";

interface Obj {
    id: number;
    name: string
};

const values = [
    { id: 1, name: smallAirplane.value + " sean" },
    { id: 2, name: smallBlueDiamond.value + " dave" }
];

SelectList<Obj>(
    ID("list1"),
    DataAttr(values),
    onInput(logInput),
    onItemSelected(logItemSelected)
);

SelectList<Obj>(
    ID("list2"),
    DataAttr(values),
    onInput(logInput),
    onItemSelected(logItemSelected)
);

const logger = WindowLogger(Query("window-logger"));

function logInput(this: SelectListElement<Obj>) {
    logger.log(this.id + ":values", ...this.selectedItems);
}

function logItemSelected(evt: SelectListItemSelectedEvent<Obj>): void {
    logger.log((evt.target as HTMLElement).id + ":" + evt.type, evt.item?.name, ...evt.items);
}