import { ID } from "@juniper-lib/dom/attrs";
import { onInput } from "@juniper-lib/dom/evts";
import { SelectList, SelectListElement, Values, onItemSelected } from "@juniper-lib/widgets/SelectList";

interface Obj {
    id: number;
    name: string
};

SelectList<Obj>(
    ID("list"),
    Values([
        { id: 1, name: "sean" },
        { id: 2, name: "dave" }
    ]),
    onInput(function (this:SelectListElement<Obj>) { console.log(this.value); }),
    onItemSelected<{ id: number, name: string }>((evt) =>
        console.log(evt.item.name))
);