import { id, name, placeHolder, required } from "@juniper-lib/dom/dist/attrs";
import { display } from "@juniper-lib/dom/dist/css";
import { Div, HtmlRender, elementClearChildren, elementSetDisplay, ErsatzElement, InputDate, InputText, InputURL, Span } from "@juniper-lib/dom/dist/tags";
import { clockwiseVerticalArrows } from "@juniper-lib/emoji/dist";
import { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Application_X_Url, MediaType } from "@juniper-lib/mediatypes/dist";
import { mediaTypesToAcceptValue } from "@juniper-lib/mediatypes/dist/util";
import { arrayReplace } from "@juniper-lib/collections/dist/arrays";
import { TypedEventBase } from "@juniper-lib/events/dist/EventBase";
import { RefreshEvent } from "@juniper-lib/events/dist/RefreshEvent";
import { isDefined, isNullOrUndefined, isString } from "@juniper-lib/tslib/dist/typeChecks";
import { YTMetadata } from "@juniper-lib/video/dist/yt-dlp";
import { BootstrapProgressBar, BootstrapProgressBarElement } from "@juniper-lib/widgets/dist/BootstrapProgressBar";
import { PropertyList } from "@juniper-lib/widgets/dist/PropertyList";
import { Throttler } from "../dom-apps/editor/Throttler";
import { FileData, Video_Vnd_DlsDc_YtDlp_Json } from "../vr-apps/yarrow/data";
import { isProxyableDomain, makeProxyURL, stripParameters } from "../vr-apps/yarrow/proxy";
import { FileDataSelectedEvent, SelectingEvent, URLSelectedEvent } from "./FilePickerEvents";
import { TagPicker } from "./TagPicker";

interface FilePickerLinkTabEvents {
    "refresh": RefreshEvent;
    "urlselected": URLSelectedEvent;
    "filedataselected": FileDataSelectedEvent;
    "selecting": SelectingEvent;
}


function makeXUrlBlob(url: URL): Blob {
    return new Blob([url.href], { type: Application_X_Url.value });
}

export class FilePickerLinkTab
    extends TypedEventBase<FilePickerLinkTabEvents>
    implements ErsatzElement {

    readonly element: HTMLElement;

    private readonly urlInput: HTMLInputElement;
    private readonly loadingIndicator: HTMLSpanElement;
    private readonly selectionMessage: HTMLDivElement;
    private readonly copyrightInput: HTMLInputElement;
    private readonly copyrightDateInput: HTMLInputElement;
    private readonly tagPicker: TagPicker;
    private readonly uploadProgress: BootstrapProgressBarElement;

    private selectedType: string = null;
    private selectedURL: URL = null;
    private readonly typeFilters = new Array<MediaType>();
    private accept: string = null;
    private selectedName: string = null;
    private checkingURL = false;

    constructor(private readonly fetcher: IFetcher, existingTagsID: string) {
        super();


        this.element = Div(
            PropertyList.create(
                ["File",
                    this.urlInput = InputURL(
                        placeHolder("Paste in URL to file"),
                        required(true)
                    ),
                    this.loadingIndicator = Span(
                        display("none"),
                        clockwiseVerticalArrows.emojiStyle
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

        const refresh = () => this.refresh();
        this.urlInput.addEventListener("input", refresh);
        this.copyrightInput.addEventListener("input", refresh);
        this.copyrightDateInput.addEventListener("input", refresh);

        const checker = new Throttler(1);

        this.urlInput.addEventListener("input", () => {
            if (this.urlInput.value.length > 0 && !/^[a-z]+:\/\//.test(this.urlInput.value)) {
                const { selectionStart, selectionEnd, selectionDirection } = this.urlInput;
                const slug = "https://";
                this.urlInput.value = slug + this.urlInput.value;
                this.urlInput.setSelectionRange(
                    selectionStart + slug.length,
                    selectionEnd + slug.length,
                    selectionDirection
                );
            }

            if (this.hasURL) {
                this.checkingURL = true;
                elementSetDisplay(this.loadingIndicator, true, "inline-block");
                checker.throttle(async () => {
                    try {
                        this.dispatchEvent(new SelectingEvent());
                        this.selectedURL = new URL(this.urlInput.value);

                        if (isProxyableDomain(this.selectedURL)) {
                            this.selectedURL = stripParameters(this.selectedURL);
                            this.urlInput.value = this.selectedURL.href;

                            const mediaType = this.selectedType = Video_Vnd_DlsDc_YtDlp_Json.value;
                            const fileURL = makeProxyURL(this.selectedURL);
                            const metadata = await this.fetcher
                                .get(fileURL)
                                .object<YTMetadata>()
                                .then(unwrapResponse);

                            const name = this.selectedName = metadata.title;
                            const copyright = this.copyrightInput.value = metadata.uploader;

                            const year = metadata.upload_date.substring(0, 4);
                            const month = metadata.upload_date.substring(4, 6);
                            const day = metadata.upload_date.substring(6, 8);
                            const copyrightDate = this.copyrightDateInput.valueAsDate = new Date(`${year}/${month}/${day}`);;

                            const file = {
                                filePath: fileURL.href,
                                mediaType,
                                name,
                                copyright,
                                copyrightDate,
                                size: null as number,
                                sizeString: "--",
                                id: null as number,
                                tagsString: null as string,
                                metadata
                            };

                            this.dispatchEvent(new FileDataSelectedEvent(file));
                        }
                        else {
                            const response = await this.fetcher
                                .head(makeProxyURL(this.selectedURL))
                                .exec();
                            const parts = this.selectedURL.pathname.split('/');
                            this.copyrightInput.value = this.selectedURL.hostname;
                            this.copyrightDateInput.valueAsDate = response.date;
                            this.selectedName = response.fileName
                                || parts[parts.length - 1];
                            this.selectedType = response.contentType;
                            this.dispatchEvent(new URLSelectedEvent(this.selectedURL));
                        }

                        this.checkingURL = false;
                        this.refresh();
                    }
                    catch (exp) {
                        this.selectedType = null;
                        this.checkingURL = false;
                        this.refresh("Not a valid target");
                    }
                });
            }

            this.refresh();
        });
    }

    clearFileSelection(tags: string[]) {
        this.uploadProgress.clear();
        this.selectedType = null;
        this.urlInput.value = null;
        this.copyrightInput.value = null;
        this.copyrightDateInput.value = null;
        this.tagPicker.tags = tags;
        this.refresh();
    }

    private addMessage(msg: string) {
        HtmlRender(this.selectionMessage, Div(msg));
    }

    refresh(errMsg?: string) {
        elementClearChildren(this.selectionMessage);
        if (isString(errMsg)) {
            this.addMessage(errMsg);
        }
        else if (this.hasURL && !this.checkingURL && !this.hasType) {
            this.addMessage("No file found at give location");
        }
        else if (this.hasType && !this.hasCorrectType) {
            this.addMessage(`Unexpected file type: ${this.selectedType}. Expected: ${this.accept}`);
        }

        if (!this.hasCopyright) {
            this.addMessage("Copyright holder is required");
        }

        if (!this.hasCopyrightDate) {
            this.addMessage("Copyright date is required");
        }

        elementSetDisplay(this.loadingIndicator, this.checkingURL);

        this.dispatchEvent(new RefreshEvent());
    }

    setTypeFilters(...types: MediaType[]): void {
        arrayReplace(this.typeFilters, ...types);
        this.accept = mediaTypesToAcceptValue(types);
    }

    private isExpectedType(contentType: string): boolean {
        if (isNullOrUndefined(contentType)) {
            return false;
        }

        if (this.typeFilters.length === 0) {
            return true;
        }

        return this.typeFilters
            .map(t => t.matches(contentType))
            .reduce((a, b) => a || b, false);
    }

    get tagString(): string {
        return this.tagPicker.tags.join();
    }

    private get hasURL() {
        return this.urlInput.validity.valid;
    }

    private get hasFile() {
        return isDefined(this.selectedURL);
    }

    private get hasType() {
        return isDefined(this.selectedType);
    }

    private get hasCorrectType() {
        return this.isExpectedType(this.selectedType);
    }

    private get hasCopyright(): boolean {
        return this.copyrightInput.value.length > 0;
    }

    private get hasCopyrightDate(): boolean {
        return this.copyrightDateInput.validity.valid;
    }

    get requirementsMet(): boolean {
        return this.hasURL
            && this.hasFile
            && this.hasCorrectType
            && this.hasCopyright
            && this.hasCopyrightDate;
    }

    async upload(): Promise<FileData> {
        try {
            const form = new FormData();
            const blob = makeXUrlBlob(this.selectedURL);
            form.set("FormFile", blob, this.selectedName);
            form.set("AltContentType", this.selectedType);
            form.set("Copyright", this.copyrightInput.value);
            form.set("CopyrightDate", this.copyrightDateInput.valueAsDate.toDateString());
            form.set("TagString", this.tagString);

            return await this.fetcher
                .post("/editor/files/create")
                .body(form)
                .progress(this.uploadProgress)
                .object<FileData>()
                .then(unwrapResponse);
        }
        catch (exp) {
            console.error(exp);
            throw exp;
        }
    }
}
