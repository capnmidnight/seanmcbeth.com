import { onInput } from "@juniper-lib/dom/dist/evts";
import { HtmlRender, InputCheckbox, InputFile, Label, Pre, PreLabeled } from "@juniper-lib/dom/dist/tags";
import { FileUploadInput } from "@juniper-lib/widgets/dist/FileUploadInput";

const input = new FileUploadInput(
    "Pick a file, any file",
    "primary",
    InputFile(),
    document.documentElement
);

const disabler = InputCheckbox(onInput(() => input.disabled = disabler.checked));

input.addEventListener("input", (evt) => {
    for (const file of evt.files) {
        HtmlRender("main", Pre(file.name));
    }
});

HtmlRender("main",
    input,
    ...PreLabeled(
        "file-disabler",
        Label("Disable picker"),
        disabler
    )
);