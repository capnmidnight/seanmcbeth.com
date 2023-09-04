import { Query } from "@juniper-lib/dom/attrs";
import { Main } from "@juniper-lib/dom/tags";
import { SelectBox } from "@juniper-lib/widgets/SelectBox";

interface Obj {
    id: number;
    name: string
};

const selectBox = new SelectBox<Obj>(
    v => v.id.toFixed(0),
    v => v.name,
    v => v.name,
    "No Object"
);

selectBox.values = [
    { id: 1, name: "sean" },
    { id: 2, name: "dave" }
];

Main(Query("main"), selectBox);