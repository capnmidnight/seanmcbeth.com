import { list, value } from "@juniper-lib/dom/attrs";
import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimarySmall, elementApply, elementClearChildren, elementSetClass, ErsatzElement, InputNumber, InputText, Option, Select } from "@juniper-lib/dom/tags";
import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { Application_JsonUTF8, MediaType } from "@juniper-lib/mediatypes";
import { mediaTypesToAcceptValue } from "@juniper-lib/mediatypes/util";
import { arrayClear, arrayReplace } from "@juniper-lib/collections/arrays";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/EventBase";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { FilterableTable } from "@juniper-lib/widgets/FilterableTable";
import { FileData } from "../vr-apps/yarrow/data";
import { FileDataSelectedEvent, SelectingEvent } from "./FilePickerEvents";
import { SearchInput } from "./models";

import "./FilePickerSelectTab.css";

class FilePickerSelectTabSearchingEvent extends TypedEvent<"searching">{
    constructor() {
        super("searching");
    }
}


class FilePickerSelectTabSearchCompleteEvent extends TypedEvent<"searchcomplete">{
    constructor() {
        super("searchcomplete");
    }
}

interface FilePickerSelectTabEvents {
    "searching": FilePickerSelectTabSearchingEvent;
    "searchcomplete": FilePickerSelectTabSearchCompleteEvent;
    "filedataselected": FileDataSelectedEvent;
    "selecting": SelectingEvent;
}

export class FilePickerSelectTab
    extends TypedEventBase<FilePickerSelectTabEvents>
    implements ErsatzElement<HTMLTableElement> {

    private readonly table: FilterableTable<FileData>;
    private readonly typeSelector: HTMLSelectElement;

    get element() { return this.table.element; };

    private readonly typeFilters = new Array<MediaType>();
    private readonly selectors = new Array<HTMLButtonElement>();
    private readonly rows = new Map<HTMLButtonElement, HTMLElement>();

    private _selectedFile: FileData = null;
    private tagFilter: string = null;
    private typeFilter: string = null;

    get selectedFile() {
        return this._selectedFile;
    }

    get hasFile() {
        return isDefined(this._selectedFile);
    }

    upload(): Promise<FileData> {
        return Promise.resolve(this.selectedFile);
    }

    get requirementsMet() {
        return this.hasFile;
    }

    constructor(private readonly fetcher: IFetcher, existingTagsID: string) {
        super();

        this.table = FilterableTable.create<FileData>({
            resourceName: "file-picker",
            columns: [{
                header: "ID",
                filter: InputNumber(),
                getCellValue: f => f.id.toFixed(0)
            }, {
                header: "Name",
                filter: InputText(),
                getCellValue: f => f.name
            }, {
                header: "Type",
                filter: this.typeSelector = Select(),
                getCellValue: f => f.mediaType
            }, {
                header: "Tags",
                filter: InputText(list(existingTagsID)),
                getCellValue: f => f.tagsString
            }, {
                header: "Size",
                getCellValue: f => f.sizeString
            }, {
                getCellValue: (f, row) => {
                    const btn = ButtonPrimarySmall(
                        "Select",
                        onClick(() => this.selectFile(btn, f))
                    );
                    this.selectors.push(btn);
                    this.rows.set(btn, row);
                    return btn;
                }
            }]
        });
    }

    setTypeFilters(...types: MediaType[]) {
        arrayReplace(this.typeFilters, ...types);
        this.typeFilter = mediaTypesToAcceptValue(this.typeFilters);
        elementClearChildren(this.typeSelector);
        elementApply(this.typeSelector,
            Option(value(""), "--"),
            ...this.typeFilters.map(t => Option(
                value(t.value),
                t.value
            ))
        )
    }

    clearFileSelection(tags: string[]) {
        this.tagFilter = tags.join();
        this.selectFile(null, null);
    }

    search(tagFilter: string) {
        this.tagFilter = tagFilter;
        return this.update();
    }

    private async update() {
        this.dispatchEvent(new FilePickerSelectTabSearchingEvent());
        arrayClear(this.selectors);
        this.rows.clear();

        const body: SearchInput = {
            typeFilter: this.typeFilter,
            tagFilter: this.tagFilter
        };

        this.table.noContentMessage = "Searching...";
        this.table.clear();

        const files = await this.fetcher
            .post("/Editor/Files/Search")
            .body(body, Application_JsonUTF8)
            .object<FileData[]>()
            .then(unwrapResponse);

        this.table.noContentMessage = "No content.";
        this.table.setValues(...files);

        this.dispatchEvent(new FilePickerSelectTabSearchCompleteEvent());
    }

    private selectFile(btn: HTMLButtonElement, fileRecord: FileData): void {
        this._selectedFile = fileRecord;

        for (const selector of this.selectors) {
            const row = this.rows.get(selector);
            const isSelected = btn === selector;
            elementSetClass(row, isSelected, "selected");
            selector.disabled = isSelected;
        }

        if (this._selectedFile) {
            this.dispatchEvent(new SelectingEvent());
            this.dispatchEvent(new FileDataSelectedEvent(this._selectedFile));
        }
    }
}
