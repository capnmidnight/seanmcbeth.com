import { getButton, getInput } from "@juniper-lib/dom/tags";
import { makeAction } from "@juniper-lib/widgets/makeAction";
import { makeAlerts } from "@juniper-lib/widgets/makeAlerts";

import "./styles.css";

const saveButton = getButton("#saveDetailButton");
const deleteButton = getButton("#deleteDetailButton");
const nameInput = getInput("#nameInput") || getInput("#headsetName");


makeAlerts();

if (saveButton) {
    makeAction("#saveDetailButton", "#saveDetailMessage", "Update");
    updateSaveButton();

    nameInput.addEventListener("input", () =>
        updateSaveButton());

    function updateSaveButton() {
        saveButton.disabled = nameInput.value.length === 0;
    }
}

if (deleteButton) {
    makeAction("#deleteDetailButton", "#deleteDetailMessage", "Delete");
}