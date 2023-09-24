import { ID, Query } from "@juniper-lib/dom/dist/attrs";
import { height, left, position, right, top, width } from "@juniper-lib/dom/dist/css";
import { Main, Nav } from "@juniper-lib/dom/dist/tags";
import { identity } from "@juniper-lib/tslib/dist/identity";
import { TreeView } from "@juniper-lib/widgets/dist/TreeView";

const values = new Array<number>();
for (let i = 0; i < 0xff; ++i) {
    values.push(i);
}

const tv = new TreeView<number, "even" | "odd">({
    showNameFilter: true,
    typeFilters: {
        getTypes: () => ["even", "odd"],
        getTypeFor: v => (v % 2) === 0 ? "even" : "odd",
        getTypeLabel: identity
    },
    defaultLabel: "numbers",
    getParent: v => v === 0 ? null : v >> 1,
    getChildDescription: v => v.toString(),
    getDescription: v => v.toLocaleString(),
    getLabel: v => v.toFixed(0),
    getOrder: v => parseFloat(v.toString()),
    canHaveChildren: node => node.isRoot || parseFloat(node.value.toString()) === node.value
},
    height("100vh"),
    width("100vw"),
    position("absolute"),
    top(0),
    left(0)
);

Nav(ID("menu"), right(0));

Main(Query("main"), tv);

tv.values = values;