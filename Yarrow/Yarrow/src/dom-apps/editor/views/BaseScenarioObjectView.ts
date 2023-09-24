import { classList, className, placeHolder } from "@juniper-lib/dom/dist/attrs";
import { onClick, onEnterKeyPressed } from "@juniper-lib/dom/dist/evts";
import { ButtonDangerSmall, Div, elementSetText, InputText, Span } from "@juniper-lib/dom/dist/tags";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { group } from "@juniper-lib/widgets/dist/PropertyList";
import { EditableScenario } from "../EditableScenario";
import { Asset, AssetDeleteEvent, AssetEvents, AssetRenameEvent, DeletableAsset } from "../models";
import { BaseScenarioView } from "./BaseScenarioView";

const DEFAULT_WARNING = "renameWarning";

export abstract class BaseScenarioObjectView<EventsT, ValueT extends DeletableAsset, ParentT extends Asset>
    extends BaseScenarioView<EventsT & AssetEvents<ValueT>, ValueT> {

    private _value: ValueT = null;

    private readonly nameInput: HTMLInputElement;
    private readonly renameWarningText: HTMLSpanElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(title: string, tips?: string[], autoRename = true) {
        super(title, tips);

        this.addProperties(
            ["Name",
                this.nameInput = InputText(
                    classList("form-control"),
                    placeHolder(title + " name")
                )
            ],

            group(DEFAULT_WARNING, Div(
                className("alert alert-warning"),
                `Cannot rename ${title} to `,
                this.renameWarningText = Span()
            ))
        );

        this.addAssetControls(
            this.deleteButton = ButtonDangerSmall(
                "Delete " + title,
                onClick(() => this.dispatchEvent(new AssetDeleteEvent(this.value)))
            )
        )

        const rename = () => {
            this.refresh();
            if (this.canRename) {
                this.dispatchEvent(new AssetRenameEvent(this.value, this.nameInput.value));
            }
        };

        if (autoRename) {
            this.nameInput.addEventListener("input", rename)
        }
        else {
            this.nameInput.addEventListener("change", rename);
            onEnterKeyPressed(rename).applyToElement(this.nameInput);
        }

        this.properties.setGroupVisible(DEFAULT_WARNING, false);
    }

    protected onScenarioChanged(_oldScenario: EditableScenario) {
        this._value = null;
        this.refreshValues();

    }

    override get value(): ValueT {
        return this._value;
    }

    override set value(v: ValueT) {
        if (v !== this.value) {
            this._value = v;
            this.refreshValues();
        }
    }

    override get hasValue(): boolean {
        return isDefined(this.value);
    }

    protected override get canEdit() {
        return super.canEdit
            && this.hasValue
            && this.hasScenario
            && !this.scenario.published;
    }

    get canDelete() {
        return this.canEdit;
    }

    get name() {
        return this.nameInput.value;
    }

    private get nameChanged() {
        return this.getValueName(this.value) !== this.name;
    }

    protected get canRename() {
        return this.canEdit
            && this.nameChanged
            && this.name.trim().length > 0;
    }

    protected onValueChanged(): void {
        if (this.hasValue) {
            this.nameInput.value = this.getValueName(this.value);
        }
        else {
            this.nameInput.value = null;
        }
    }

    refreshValues() {
        this.onValueChanged();
        this.refresh();
    }

    protected override onRefresh(): void {
        super.onRefresh();

        elementSetText(this.renameWarningText, `'${this.name}'`);

        this.properties.setGroupVisible(
            DEFAULT_WARNING,
            this.canEdit
            && this.nameChanged
            && !this.canRename
        );

        this.nameInput.disabled = !this.canEdit;
        this.deleteButton.disabled = !this.canDelete;
    }

    protected abstract getValueName(value: ValueT): string;

    abstract createValue(parent: ParentT, prog?: IProgress): Promise<ValueT>;
    abstract renameValue(value: ValueT, newName: string): void;
    abstract deleteValue(value: ValueT): Promise<void>;
}