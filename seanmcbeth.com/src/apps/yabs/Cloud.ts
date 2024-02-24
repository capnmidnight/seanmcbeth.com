import { backgroundColor, borderBottomLeftRadius, borderBottomRightRadius, borderTopLeftRadius, borderTopRightRadius, height, position, px, rule, width } from "@juniper-lib/dom/dist/css";
import { StyleBlob } from "@juniper-lib/dom/dist/tags";
import { EventTargetMixin } from "@juniper-lib/events/dist/EventTarget";
import { GameObject } from "./GameObject";
import { randomInt, randomRange } from "@juniper-lib/tslib/dist/math";

const cloudStyle = StyleBlob(
    rule(":host, .cloud-bit",
        position("absolute")
    ),

    rule(".cloud-bit",
        backgroundColor("white"),
        width(px(100)),
        height(px(50)),
        borderBottomRightRadius(px(25)),
        borderBottomLeftRadius(px(50)),
        borderTopRightRadius(px(12.5)),
        borderTopLeftRadius(px(6.25))
    )
);

export function Cloud() { return document.createElement("yabs-cloud") as CloudElement; }

class CloudElement extends HTMLElement implements GameObject {
    x: number;
    private y: number;
    private dx: number;

    private readonly bits = new Array<HTMLDivElement>();
    private readonly eventTarget: EventTargetMixin;
    constructor() {
        super();

        this.eventTarget = new EventTargetMixin(
            super.addEventListener.bind(this),
            super.removeEventListener.bind(this),
            super.dispatchEvent.bind(this)
        );

        const n = randomInt(4, 7);
        for (let i = 0; i < n; ++i) {
            const b = document.createElement("div");
            b.className = "cloud-bit";
            b.style.top = px(randomRange(-25, 25));
            b.style.left = px(randomRange(-50, 50));
            this.bits.push(b);
        }

        this.x = randomRange(0, window.innerWidth);
        this.y = randomRange(0, window.innerHeight / 4) + 50;
        this.dx = randomRange(-0.25, 0.25);
    }

    override addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.eventTarget.addEventListener(type, callback, options);
    }

    override removeEventListener(type: string, callback: EventListenerOrEventListenerObject) {
        this.eventTarget.removeEventListener(type, callback);
    }

    override dispatchEvent(evt: Event): boolean {
        return this.eventTarget.dispatchEvent(evt);
    }

    addBubbler(bubbler: EventTarget) {
        this.eventTarget.addBubbler(bubbler);
    }

    removeBubbler(bubbler: EventTarget) {
        this.eventTarget.removeBubbler(bubbler);
    }

    addScopedEventListener(scope: object, type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.eventTarget.addScopedEventListener(scope, type, callback, options);
    }

    removeScope(scope: object) {
        this.eventTarget.removeScope(scope);
    }

    clearEventListeners(type?: string): void {
        this.eventTarget.clearEventListeners(type);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.append(cloudStyle.cloneNode(), ...this.bits);
        this.style.zIndex = (-this.y).toFixed(0);
        this.render();
    }

    render() {
        this.style.left = px(this.x);
        this.style.top = px(this.y);
    }

    update(dt: number) {
        this.x += this.dx * dt;
        if (this.x <= 0 && this.dx < 0 || (this.x +
            this.clientWidth) >= window.innerWidth && this.dx >
            0) {
            this.dx *= -1;
        }
    }
}
customElements.define("yabs-cloud", CloudElement);