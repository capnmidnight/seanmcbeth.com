import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { arrayReplace } from "@juniper-lib/collections/dist/arrays";
import { ClassName, CustomData, ID, Value } from "@juniper-lib/dom/dist/attrs";
import { DataList, Div, HtmlRender, Option, buttonSetEnabled, elementClearChildren } from "@juniper-lib/dom/dist/tags";
import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { MediaType } from "@juniper-lib/mediatypes/dist";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { DialogBox } from "@juniper-lib/widgets/dist/DialogBox";
import { TabPanel, TabPanelElement } from "@juniper-lib/widgets/dist/TabPanel";
import type { FileData } from "../vr-apps/yarrow/data";
import { FilePickerLinkTab } from "./FilePickerLinkTab";
import { FilePickerSelectTab } from "./FilePickerSelectTab";
import { FilePickerUploadTab } from "./FilePickerUploadTab";
import { FilePreviewer } from "./FilePreviewer";
import type { FileTypes } from "./models";

const EXISTING_TAGS_ID = "existingTags";

import "./FilePicker.css";

type TabNames = "upload-file"
    | "link-file"
    | "pick-file";

export class FilePicker extends DialogBox {
    private readonly preview: FilePreviewer;
    private readonly tags = new Array<string>();

    private readonly tabs: TabPanelElement<TabNames>;
    private readonly existingTags: HTMLDataListElement;
    private readonly uploadTab: FilePickerUploadTab;
    private readonly linkTab: FilePickerLinkTab;
    private readonly selectTab: FilePickerSelectTab;

    private _selectedFile: FileData = null;
    get selectedFile() {
        return this._selectedFile;
    }

    constructor(private readonly fetcher: IFetcher, audioSys: JuniperAudioContext | Environment) {
        super("File Upload");

        this.element.classList.add("file-picker");
        this.preview = new FilePreviewer(
            Div(ClassName("preview")),
            this.fetcher,
            audioSys);

        HtmlRender(this.contentArea,
            this.existingTags = DataList(ID(EXISTING_TAGS_ID)),
            this.tabs = TabPanel(
                Div(
                    CustomData("tab-name", "Upload new file"),
                    this.uploadTab = new FilePickerUploadTab(this.fetcher, EXISTING_TAGS_ID)
                ),
                Div(
                    CustomData("tab-name", "Link to file"),
                    this.linkTab = new FilePickerLinkTab(this.fetcher, EXISTING_TAGS_ID)
                ),
                Div(
                    CustomData("tab-name", "Pick existing file"),
                    this.selectTab = new FilePickerSelectTab(this.fetcher, EXISTING_TAGS_ID)
                )
            ),
            this.preview
        );

        const refresh = () =>
            this.refresh();

        const showLoading = () =>
            this.preview.showLoading();

        const previewFile = (evt: Event & { file: FileTypes }) =>
            this.preview.setFile(evt.file, ...this.tags);

        this.uploadTab.addEventListener("refresh", refresh);
        this.linkTab.addEventListener("refresh", refresh);

        this.linkTab.addEventListener("selecting", showLoading);
        this.selectTab.addEventListener("selecting", showLoading);

        this.uploadTab.addEventListener("fileselected", previewFile);
        this.linkTab.addEventListener("filedataselected", previewFile);
        this.linkTab.addEventListener("urlselected", previewFile);
        this.selectTab.addEventListener("filedataselected", (evt) => {
            refresh();
            previewFile(evt);
        });

        this.selectTab.addEventListener("searching", () => {
            this.confirmButton.disabled = true;
            this.cancelButton.disabled = true;
        });

        this.selectTab.addEventListener("searchcomplete", () => {
            this.confirmButton.disabled = !this.canConfirm;
            this.cancelButton.disabled = false;
        });

        this.tabs.addEventListener("tabselected",
            this.clearFileSelection.bind(this));

        this.getTags();
    }

    setTags(...tags: string[]) {
        arrayReplace(this.tags, ...tags);
        this.tags.sort();
    }

    setTypeFilters(...types: MediaType[]) {
        this.uploadTab.setTypeFilters(...types);
        this.linkTab.setTypeFilters(...types);
        this.selectTab.setTypeFilters(...types);
    }

    private async getTags() {
        const tags = await this.fetcher
            .get("/editor/files/tags")
            .object<string[]>()
            .then(unwrapResponse);
        elementClearChildren(this.existingTags);
        this.existingTags.append(
            ...tags.map(tag => Option(
                Value(tag),
                tag)
            )
        );
    }

    private clearFileSelection(): void {
        this.preview.clear();
        this.uploadTab.clearFileSelection(this.tags);
        this.linkTab.clearFileSelection(this.tags);
        this.selectTab.clearFileSelection(this.tags);
    }

    protected override onShown(): void {
        super.onShown();

        this.clearFileSelection();
        this.tabs.select("upload-file");
        this.selectTab.search(this.tags.join());
    }

    protected override async onConfirm(): Promise<void> {
        this.confirmButton.disabled = true;
        this._selectedFile = await this.currentTab.upload();
        super.onConfirm();
    }

    protected override onClosed(): void {
        this.clearFileSelection();
        this.preview.clear();
        this.getTags();
        super.onClosed();
    }

    private get isUploading(): boolean {
        return this.tabs.isSelected("upload-file");
    }

    private get isLinking(): boolean {
        return this.tabs.isSelected("link-file");
    }

    private get isSelecting(): boolean {
        return this.tabs.isSelected("pick-file");
    }

    private get currentTab() {
        return this.isUploading && this.uploadTab
            || this.isLinking && this.linkTab
            || this.isSelecting && this.selectTab;
    }

    private get canConfirm(): boolean {
        return this.currentTab.requirementsMet;
    }

    refresh(): void {
        const msg = this.canConfirm
            ? "Confirm"
            : this.isUploading
                ? "Upload requirements not met"
                : this.isLinking
                    ? "Link requirements not met"
                    : "No file choice made";
        buttonSetEnabled(
            this.confirmButton,
            this.canConfirm,
            msg,
            msg
        );
    }
}
