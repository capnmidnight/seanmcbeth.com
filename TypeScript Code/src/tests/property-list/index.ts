import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, elementApply } from "@juniper-lib/dom/tags";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
const [propList1] = PropertyList.find();

elementApply("main",
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