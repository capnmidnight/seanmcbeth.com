import { id, name, required } from "@juniper-lib/dom/attrs";
import {
    Div,
    elementApply,
    elementClearChildren, ErsatzElement, InputDate,
    InputFile,
    InputText
} from "@juniper-lib/dom/tags";
import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { MediaType } from "@juniper-lib/mediatypes";
import { MediaTypeDB } from "@juniper-lib/mediatypes/db";
import { TypedEventBase } from "@juniper-lib/events/EventBase";
import { RefreshEvent } from "@juniper-lib/events/RefreshEvent";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { BootstrapProgressBar, BootstrapProgressBarElement } from "@juniper-lib/widgets/BootstrapProgressBar";
import { FileUploadInput } from "@juniper-lib/widgets/FileUploadInput";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
import { FileData } from "../vr-apps/yarrow/data";
import { FileSelectedEvent } from "./FilePickerEvents";
import { TagPicker } from "./TagPicker";

interface FilePickerUploadTabEvents {
    "refresh": RefreshEvent;
    "fileselected": FileSelectedEvent;
}

export class FilePickerUploadTab
    extends TypedEventBase<FilePickerUploadTabEvents>
    implements ErsatzElement {

    readonly element: HTMLElement;

    private readonly picker: FileUploadInput;
    private readonly selectionMessage: HTMLDivElement;
    private readonly copyrightInput: HTMLInputElement;
    private readonly copyrightDateInput: HTMLInputElement;
    private readonly tagPicker: TagPicker;
    private readonly uploadProgress: BootstrapProgressBarElement;

    private selectedFile: File = null;
    private selectedType: string = null;

    constructor(private readonly fetcher: IFetcher, existingTagsID: string) {

        super();

        this.element = Div(
            PropertyList.create(
                ["File",
                    this.picker = new FileUploadInput(
                        "Upload new file",
                        "primary",
                        InputFile(
                            required(true)
                        )
                    ),
                    this.selectionMessage = Div()],

                ["Copyright",
                    this.copyrightInput = InputText(
                        id("copyright"),
                        name("copyright"),
                        required(true)
                    )],

                ["Copyright date",
                    this.copyrightDateInput = InputDate(
                        id("copyrightDate"),
                        name("copyrightDate"),
                        required(true)
                    )],

                ["Tags",
                    this.tagPicker = new TagPicker(existingTagsID)
                ]
            ),
            this.uploadProgress = BootstrapProgressBar("progress")
        );

        this.picker.dragTarget = this.element;

        this.picker.addEventListener("input", async (evt) => {
            if (evt.files.length > 0) {
                this.selectedFile = evt.files[0];
                this.selectedType = this.selectedFile.type;
                if (isNullOrUndefined(this.selectedType) || this.selectedType.length === 0) {
                    this.selectedType = MediaTypeDB.normalizeFileType(this.selectedFile.name, this.selectedType);
                }
                this.refresh();
                this.dispatchEvent(new FileSelectedEvent(this.selectedFile, this.selectedType));
            }
        });

        const refresh = this.refresh.bind(this);
        this.copyrightInput.addEventListener("input", refresh);
        this.copyrightDateInput.addEventListener("input", refresh);
    }

    setTypeFilters(...types: MediaType[]) {
        this.picker.setTypeFilters(...types);
    }

    get accept() {
        return this.picker.accept;
    }

    private addMessage(msg: string) {
        elementApply(this.selectionMessage, Div(msg));
    }

    refresh() {
        elementClearChildren(this.selectionMessage);
        if (this.hasType && !this.hasCorrectType) {
            this.addMessage(`Unexpected file type: ${this.selectedType}. Expected: ${this.picker.accept}`);
        }

        if (!this.hasCopyright) {
            this.addMessage("Copyright holder is required");
        }

        if (!this.hasCopyrightDate) {
            this.addMessage("Copyright date is required");
        }

        this.dispatchEvent(new RefreshEvent());
    }

    clearFileSelection(tags: string[]) {
        this.uploadProgress.clear();
        this.selectedType = null;
        this.picker.clear();
        this.copyrightInput.value = null;
        this.copyrightDateInput.value = null;
        this.tagPicker.tags = tags;
        this.refresh();
    }

    get tagString(): string {
        return this.tagPicker.tags.join(",");
    }

    private get hasFile() {
        return isDefined(this.selectedFile);
    }

    private get hasType() {
        return isDefined(this.selectedType);
    }

    private get hasCorrectType() {
        return this.picker.isExpectedType(this.selectedType);
    }

    private get hasCopyright(): boolean {
        return this.copyrightInput.value.length > 0;
    }

    private get hasCopyrightDate(): boolean {
        return this.copyrightDateInput.validity.valid;
    }

    get requirementsMet(): boolean {
        return this.hasFile
            && this.hasCorrectType
            && this.hasCopyright
            && this.hasCopyrightDate;
    }

    upload() {
        const form = new FormData();
        form.set("FormFile", this.selectedFile, this.selectedFile.name);
        form.set("Copyright", this.copyrightInput.value);
        form.set("CopyrightDate", this.copyrightDateInput.valueAsDate.toDateString());
        form.set("TagString", this.tagString);

        return this.fetcher
            .post("/editor/files/create")
            .body(form)
            .progress(this.uploadProgress)
            .object<FileData>()
            .then(unwrapResponse);
    }
}

