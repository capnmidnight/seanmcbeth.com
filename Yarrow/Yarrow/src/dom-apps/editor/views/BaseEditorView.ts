import { elementIsDisplayed, elementSetDisplay, ErsatzElement } from "@juniper-lib/dom/dist/tags";
import { debounce } from "@juniper-lib/events/dist/debounce";
import { TypedEventMap, TypedEventTarget } from "@juniper-lib/events/dist/TypedEventTarget";

export abstract class BaseEditorView<EventsT extends TypedEventMap<string>>
    extends TypedEventTarget<EventsT>
    implements ErsatzElement {

    protected _element: HTMLElement = null;
    private _enabled: boolean = true;

    public readonly refresh: () => void;

    constructor() {
        super();

        this.refresh = debounce(() => this.onRefresh());
    }

    get visible() {
        return elementIsDisplayed(this.element);
    }

    set visible(v) {
        elementSetDisplay(this.element, v);
    }

    public get element(): HTMLElement {
        return this._element;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(v: boolean) {
        if (v !== this.enabled) {
            this._enabled = v;
            this.refresh();
        }
    }

    get disabled() {
        return !this.enabled;
    }

    set disabled(v) {
        this.enabled = !v;
    }

    protected abstract onRefresh(): void;
}
