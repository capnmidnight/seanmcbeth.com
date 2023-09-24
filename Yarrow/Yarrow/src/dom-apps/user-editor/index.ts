import { buttonSetEnabled, elementSetClass, getButton, getInput } from "@juniper-lib/dom/dist/tags";

const userNameInput = getInput("#newUserName");
const userEmailInput = getInput("#newUserEmail");
const submitButton = getButton("#submitNewUserButton");

function refresh() {
    const enabled = userEmailInput.value.length > 0
        && userNameInput.value.length > 0;
    const title = enabled
        ? "Create new user"
        : "Please enter username/email address";
    buttonSetEnabled(submitButton,
        enabled,
        "Create",
        title);
    elementSetClass(submitButton, enabled, "btn-danger");
    elementSetClass(submitButton, !enabled, "btn-outline-danger");
}

userNameInput.addEventListener("input", refresh);
userEmailInput.addEventListener("input", refresh);
refresh(); 