import { ClassName } from "@juniper-lib/dom/dist/attrs";
import { fr } from "@juniper-lib/dom/dist/css";
import { Div, elementInsertBefore, Elements } from "@juniper-lib/dom/dist/tags";
import { TypedEventMap } from "@juniper-lib/events/dist/TypedEventTarget";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { Property, PropertyList } from "@juniper-lib/widgets/dist/PropertyList";
import { ScrollPanel } from "@juniper-lib/widgets/dist/ScrollPanel";
import { TipBox } from "@juniper-lib/widgets/dist/TipBox";
import { EditableScenario } from "../EditableScenario";
import { Asset } from "../models";
import { BaseEditorView } from "./BaseEditorView";

export abstract class BaseScenarioView<EventsT extends TypedEventMap<string>, ValueT extends Asset> extends BaseEditorView<EventsT> {

    private _scenario: EditableScenario = null;

    protected readonly scrollPanel: ScrollPanel;
    protected readonly properties: PropertyList;
    private readonly assetControls: HTMLElement;

    constructor(public readonly title: string, tips?: string[]) {
        super();

        this._element = Div(
            ClassName("section"),
            this.scrollPanel = new ScrollPanel(
                this.properties = PropertyList.create()
            ),
            this.assetControls = Div(
                ClassName("controls"),
            )
        );

        if (isDefined(tips) && tips.length > 0) {
            elementInsertBefore(
                this.element,
                TipBox(title + "Tips", ...tips),
                this.scrollPanel
            );
        }
    }

    protected addProperties(...rest: Property[]) {
        this.properties.append(...rest);
    }

    protected addAssetControls(...rest: Elements[]) {
        for (let i = rest.length - 1; i >= 0; --i) {
            elementInsertBefore(this.assetControls, rest[i], this.assetControls.children[0] as HTMLElement);
        }
    }

    get scenario(): EditableScenario {
        return this._scenario;
    }

    set scenario(v: EditableScenario) {
        if (v !== this.scenario) {
            const oldScenario = this.scenario;
            this._scenario = v;
            this.onScenarioChanged(oldScenario);
        }
    }

    protected abstract onScenarioChanged(_oldScenario: EditableScenario): void;

    get hasScenario(): boolean {
        return !!this.scenario;
    }

    protected get canEdit() {
        return this.enabled
            && this.hasScenario;
    }

    protected onRefresh(): void {
        let rowTemplateParts = new Array<string>();
        for (let i = 0; i < this.element.childElementCount; ++i) {
            const child = this.element.children[i];
            if (child === this.scrollPanel.element) {
                rowTemplateParts.push(fr(1));
            }
            else {
                rowTemplateParts.push("auto");
            }
        }

        this.element.style.gridTemplateRows = rowTemplateParts.join(" ");

        this.properties.disabled
            = !this.canEdit;
    }

    abstract get value(): ValueT;
    abstract set value(v: ValueT);
    abstract get hasValue(): boolean;
}