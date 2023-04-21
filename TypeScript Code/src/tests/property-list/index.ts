import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, HR, InputText, elementApply, getElement } from "@juniper-lib/dom/tags";
import { PropertyList, group } from "@juniper-lib/widgets/PropertyList";

const propList1 = new PropertyList(getElement("#PropertyList1"));
const propList2 = PropertyList.create(
    "Text 3",
    InputText(),
    ["Field 5", "Value 5"],
    ["Field 6", "Value 6", "Value 7"],
    ["Field 7", InputText()],
    group(
        "Group 2",
        "Text 4",
        InputText(),
        ["Field 8", "Value 8"]
    )
);

elementApply("main",
    ButtonPrimary(
        "Toggle Group",
        onClick(() => {
            propList1.setGroupVisible("Group 1", !propList1.getGroupVisible("Group 1"));
            propList2.setGroupVisible("Group 2", !propList2.getGroupVisible("Group 2"));
        })
    ),
    ButtonPrimary(
        "Toggle Disabled",
        onClick(() => {
            propList1.disabled = !propList1.disabled;
            propList2.disabled = !propList2.disabled;
        })
    ),
    propList1,
    HR(),
    propList2
);