import { getButton, getInput } from "@juniper-lib/dom/dist/tags";
import { makeAction } from "@juniper-lib/widgets/dist/makeAction";
import { makeAlerts } from "@juniper-lib/widgets/dist/makeAlerts";

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