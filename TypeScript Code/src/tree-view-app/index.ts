import { height } from "@juniper-lib/dom/css";
import { elementApply } from "@juniper-lib/dom/tags";
import { TreeView } from "@juniper-lib/widgets/TreeView";

const values = new Array<number>();
for (let i = 0; i < 0xff; ++i) {
    values.push(i);
}

const tv = new TreeView<number>({
    getParent: v => v === 0 ? null : v >> 1,
    canHaveChildren: v => parseFloat(v.toString()) === v,
    getChildDescription: v => v.toString(),
    getDescription: v => v.toLocaleString(),
    getLabel: v => v.toFixed(3),
    getOrder: v => parseFloat(v.toString())
},
    height("100vh"));

elementApply(document.body, tv);

tv.values = values;
