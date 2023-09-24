import { id, list, multiple, value } from "@juniper-lib/dom/dist/attrs";
import { display, em, gridAutoFlow, perc, width } from "@juniper-lib/dom/dist/css";
import { makeEnterKeyEventHandler } from "@juniper-lib/dom/dist/evts";
import { ButtonDanger, ButtonPrimary, Div, HtmlRender, elementClearChildren, ErsatzElement, InputText, Option, Select } from "@juniper-lib/dom/dist/tags";
import { arrayReplace, arraySortedInsert } from "@juniper-lib/collections/dist/arrays";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/dist/EventBase";
import { isString } from "@juniper-lib/tslib/dist/typeChecks";

export class TagPickerTagsChangedEvent extends TypedEvent<"tagschanged"> {
    constructor(public tags: readonly string[]) {
        super("tagschanged");
    }
}

interface TagPickerEvents {
    tagschanged: TagPickerTagsChangedEvent;
}

const fullWidth = width(perc(100));

export class TagPicker extends TypedEventBase<TagPickerEvents> implements ErsatzElement {
    readonly element: HTMLElement;

    private readonly _tags = new Array<string>();
    private readonly newTagName: HTMLInputElement;
    private readonly addTagButton: HTMLButtonElement;
    private readonly removeTagButton: HTMLButtonElement;
    private readonly tagsList: HTMLSelectElement;

    constructor(existingTagsID: string);
    constructor(newTagName: HTMLInputElement,
        addTagButton: HTMLButtonElement,
        removeTagButton: HTMLButtonElement,
        tagsList: HTMLSelectElement);
    constructor(newTagNameOrExistingTagsID: HTMLInputElement | string,
        addTagButton?: HTMLButtonElement,
        removeTagButton?: HTMLButtonElement,
        tagsList?: HTMLSelectElement) {
        super();

        this.element = Div(
            display("grid"),
            gridAutoFlow("row"),
            width(em(10))
        );

        if (isString(newTagNameOrExistingTagsID)) {
            this.newTagName = InputText(
                id("newTagName"),
                list(newTagNameOrExistingTagsID),
                fullWidth
            );

            this.addTagButton = ButtonPrimary(
                id("addTagButton"),
                fullWidth,
                "Add"
            );

            this.removeTagButton = ButtonDanger(
                id("removeTagButton"),
                fullWidth,
                "Remove"
            );

            this.tagsList = Select(
                id("tagsList"),
                multiple(true),
                fullWidth
            );
        }
        else {
            this.newTagName = newTagNameOrExistingTagsID;
            this.addTagButton = addTagButton;
            this.removeTagButton = removeTagButton;
            this.tagsList = tagsList;
            this.newTagName.replaceWith(this.element);
        }


        HtmlRender(this.element,
            this.newTagName,
            this.addTagButton,
            this.tagsList,
            this.removeTagButton
        );

        this.addTagButton.disabled = true;
        this.removeTagButton.disabled = true;

        this.newTagName.addEventListener("input", () => {
            this.addTagButton.disabled = this.newTagName.value.length === 0;
        });

        const addTag = () => {
            if (this.newTagName.value.length > 0) {
                this.updateTags(this.newTagName.value.toLocaleLowerCase(), null);
            }
        };

        this.addTagButton.addEventListener("click", addTag);
        this.newTagName.addEventListener("keydown", makeEnterKeyEventHandler(addTag));

        this.tagsList.addEventListener("input", () => {
            this.removeTagButton.disabled = this.tagsList.selectedIndex === -1;
        });

        this.removeTagButton.addEventListener("click", () => {
            if (this.tagsList.selectedIndex > -1) {
                const tag = this.tagsList.selectedOptions[0].value;
                this.updateTags(null, tag);
            }
        });
    }

    private updateTags(newTag: string, oldTag: string) {
        const tags = new Array<string>();

        if (newTag !== null) {
            newTag = newTag.trim().toLocaleLowerCase();
            if (newTag.length > 0) {
                arraySortedInsert(tags, newTag, false);
            }
        }

        for (let i = 0; i < this.tagsList.options.length; ++i) {
            const tag = this.tagsList.options[i].value;
            if (tag !== oldTag) {
                arraySortedInsert(tags, tag, false);
            }
        }

        this.tags = tags;

        this.dispatchEvent(new TagPickerTagsChangedEvent(tags));
    }

    get tags(): readonly string[] {
        return this._tags;
    }

    set tags(tags: readonly string[]) {
        arrayReplace(this._tags, ...tags);
        this._tags.sort();
        elementClearChildren(this.tagsList);
        this.tagsList.append(...tags.map(t => Option(value(t), t)));
        this.newTagName.value = "";
        this.addTagButton.disabled
            = this.removeTagButton.disabled
            = true;
    }
}
