import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { getButton, getElement, getInput, getSelect } from "@juniper-lib/dom/tags";
import { FileUploadInput } from "@juniper-lib/widgets/FileUploadInput";
import { createFetcher } from "../../createFetcher";
import { FilePreviewer } from "../../file-picker/FilePreviewer";
import type { TagPickerTagsChangedEvent } from "../../file-picker/TagPicker";
import { TagPicker } from "../../file-picker/TagPicker";

const tagString = getInput("#tagString");
const context = new JuniperAudioContext();
const filePicker = new FileUploadInput(
    "Select file",
    "primary",
    getInput("#formFile"));
const filePreview = new FilePreviewer(
    getElement("#preview"),
    createFetcher(),
    context);
const tagPicker = new TagPicker (
    getInput("#newTagName"),
    getButton("#addTagButton"),
    getButton("#removeTagButton"),
    getSelect("#tagsList"));

filePicker.addEventListener("input", async (evt) => {
    if (evt.files.length > 0) {
        await filePreview.setFile(evt.files[0], ...tagPicker.tags);
    }
});

tagPicker.addEventListener("tagschanged", async (evt: TagPickerTagsChangedEvent) => {
    tagString.value = evt.tags.join(",");
    tagPicker.tags = evt.tags;
});