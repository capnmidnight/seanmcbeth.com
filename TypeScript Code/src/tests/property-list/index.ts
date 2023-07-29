import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, HtmlRender } from "@juniper-lib/dom/tags";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
const [propList1] = PropertyList.find();

HtmlRender("main",
    ButtonPrimary(
        "Toggle Group",
        onClick(() => {
            propList1.setGroupVisible("Group 1", !propList1.getGroupVisible("Group 1"));
        })
    ),
    ButtonPrimary(
        "Toggle Disabled",
        onClick(() => {
            propList1.disabled = !propList1.disabled;
        })
    ),
    propList1
);