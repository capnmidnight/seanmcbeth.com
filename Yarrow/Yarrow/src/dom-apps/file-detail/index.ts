import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { getButton, getElement, getInput, getSelect } from "@juniper-lib/dom/tags";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes";
import { FileUploadInput } from "@juniper-lib/widgets/FileUploadInput";
import { createFetcher } from "../../createFetcher";
import { FilePreviewer } from "../../file-picker/FilePreviewer";
import { TagPicker, TagPickerTagsChangedEvent } from "../../file-picker/TagPicker";

const fetcher = createFetcher(false);
const tagPicker = new TagPicker(
    getInput("#newTagName"),
    getButton("#addTagButton"),
    getButton("#removeTagButton"),
    getSelect("#tagsList"));
const context = new JuniperAudioContext();
const thumbnailFile = new FileUploadInput(
    "Replace file",
    "danger",
    getInput("#formFile"));
const preview = new FilePreviewer(
    getElement("#filePreview"),
    fetcher,
    context);
const confirmUpdate = getElement("#confirmUpdate");

tagPicker.addEventListener("tagschanged", async (evt: TagPickerTagsChangedEvent) => {
    const tagString = evt.tags.join(",");

    await fetcher
        .post(location.pathname)
        .query("handler", "Tag")
        .body(tagString, Application_JsonUTF8)
        .exec();
    
    tagPicker.tags = evt.tags;
});

thumbnailFile.addEventListener("input", async (evt) => {
    if (evt.files.length > 0) {
        await preview.setFile(evt.files[0], ...tagPicker.tags);
    }

    confirmUpdate.style.display = preview.hasFile
        ? "block"
        : "none";
});