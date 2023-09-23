import { isString } from "@juniper-lib/tslib/typeChecks";

for (const button of document.querySelectorAll<HTMLButtonElement>("button[type=button].confirm-button")) {
    const warningName = button.dataset.updatemessage;
    if (isString(warningName)) {
        button.addEventListener("click", function (this: HTMLButtonElement) {
            this.parentElement.querySelector<HTMLElement>(`span.${warningName}`).style.display = "block";
        });
    }
    else {
        button.addEventListener("click", function (this: HTMLButtonElement) {
            this.parentElement.style.display = "none";
        });
    }
}