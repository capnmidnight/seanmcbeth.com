import { onInput } from "@juniper-lib/dom/evts";
import { elementApply, InputCheckbox, InputFile, Label, Pre, PreLabeled } from "@juniper-lib/dom/tags";
import { FileUploadInput } from "@juniper-lib/widgets/FileUploadInput";

const input = new FileUploadInput(
    "Pick a file, any file",
    "primary",
    InputFile(),
    document.documentElement
);

const disabler = InputCheckbox(onInput(() => input.disabled = disabler.checked));

input.addEventListener("input", (evt) => {
    for (const file of evt.files) {
        elementApply("main", Pre(file.name));
    }
});

elementApply("main",
    input,
    ...PreLabeled(
        "file-disabler",
        Label("Disable picker"),
        disabler
    )
);