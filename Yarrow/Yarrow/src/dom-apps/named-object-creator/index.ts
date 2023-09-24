import { elementSetClass, getButton, getInput } from "@juniper-lib/dom/dist/tags";

const roleNameInput = getInput("#newName");
const submitButton = getButton("#submitNewNameButton");

roleNameInput.addEventListener("input", () => {
    const hasValue = roleNameInput.value.length > 0
    submitButton.disabled = !hasValue;
    elementSetClass(submitButton, hasValue, "btn-danger");
    elementSetClass(submitButton, !hasValue, "btn-outline-danger");
});