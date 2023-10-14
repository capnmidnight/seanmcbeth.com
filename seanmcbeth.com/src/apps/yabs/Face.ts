import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { ClassList } from "@juniper-lib/dom/dist/attrs";
import { backgroundColor, backgroundImage, borderColor, borderRadius, borderStyle, borderWidth, color, deg, display, fontFamily, fontSize, fontWeight, getMonospaceFamily, height, overflow, padding, position, px, rotate, rule, textTransform, transform, width, zIndex } from "@juniper-lib/dom/dist/css";
import { onMouseOut, onTouchStart } from "@juniper-lib/dom/dist/evts";
import { Div, StyleBlob } from "@juniper-lib/dom/dist/tags";
import { EventTargetMixin } from "@juniper-lib/events/dist/EventTarget";
import { happyFaces, play, randomInt, randomRange, sadFaces, score, shake, skins } from ".";
import { GameObject } from "./GameObject";

const faceStyle = StyleBlob(
    rule(".frowny, .shadow, .boop",
        position("absolute")
    ),

    rule(".frowny",
        fontSize(px(32)),
        getMonospaceFamily(),
        color("black"),
        padding(px(5)),
        borderStyle("solid"),
        borderWidth(px(2)),
        borderColor("black"),
        borderRadius(px(10)),
        transform(rotate(deg(90))),
        width(px(50)),
        height(px(50)),
        overflow("hidden")
    ),

    rule(".shadow",
        width(px(45)),
        height(px(10)),
        borderRadius(px(5)),
        backgroundImage("radial-gradient(rgba(0,0,0,0.5), transparent)")
    ),

    rule(".boop",
        display("none"),
        color("white"),
        textTransform("uppercase"),
        fontFamily("sans-serif"),
        fontWeight("bold"),
        fontSize(px(13)),
        zIndex(9001)
    )
);

export function Face() { return document.createElement("yabs-face") as FaceElement; }

export class FaceElement extends HTMLElement implements GameObject {
    #fade = new Event("fade");
    private element: HTMLElement;
    private boop: HTMLElement;
    private shadow: HTMLElement;
    alive: boolean;
    hits: number;
    onground: boolean;
    x: number;
    private y: number;
    private z: number;
    private f: number;
    private dx: number;
    private dy: number;
    private df: number;
    private width: number;
    private height: number;
    private boopFor: number;
    private boopX: number;
    private boopY: number;
    private boopDX: number;
    private boopDY: number;

    private eventTarget: EventTargetMixin;

    constructor() {
        super();
        
        this.eventTarget = new EventTargetMixin(
            super.addEventListener.bind(this),
            super.removeEventListener.bind(this),
            super.dispatchEvent.bind(this)
        );

        this.alive = true;
        this.hits = 0;
        this.onground = false;
        this.x = randomRange(0, window.innerWidth);
        this.y = randomRange(0, window.innerHeight / 2);
        this.z = randomInt(0, 10);
        this.f = 0;
        this.dx = randomRange(-1, 1);
        this.dy = 0;
        this.df = randomRange(0.05, 0.1);
        this.element = Div(
            ClassList("frowny"),
            onMouseOut(this.jump.bind(this, "boop")),
            onTouchStart(this.jump.bind(this, "boop")),
            backgroundColor(arrayRandom(skins)),
            zIndex(this.z)
        );

        this.width = 5;
        this.height = 5;

        this.boop = Div(ClassList("boop"), "boop");
        this.boopFor = 0;
        this.boopX = 0;
        this.boopY = 0;
        this.boopDX = 0;
        this.boopDY = 0;

        this.shadow = Div(
            ClassList("shadow"),
            zIndex(this.z - 1)
        );
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

        shadowRoot.append(faceStyle.cloneNode(), this.element, this.boop, this.shadow);

        this.render();
    }

    jump(word: string) {
        if (this.onground) {
            this.boop.innerHTML = word;
            this.dy = -5;
            this.onground = false;
            this.boopX = this.x;
            this.boopY = this.y - 125;
            this.boopDX = randomRange(-0.5, 0.5);
            this.boopDY = randomRange(-0.5, 0);
            this.boopFor = 100;
            play(30 + 3 * randomInt(0, 5), 0.125, 0.05);
            this.dispatchEvent(this.#fade);
        }
    }

    render() {
        this.boop.style.display = this.boopFor > 0 ? "block" : "none";
        this.boop.style.left = px(this.boopX);
        this.boop.style.top = px(this.boopY);
        this.boop.style.transform = `scale(${(0.5 + this.boopFor / 200)})`;
        this.shadow.style.left = this.element.style.left = px(this.x);
        this.element.style.top = px(this.y + 10 * this.z - 120);
        this.shadow.style.top = px(10 * this.z + window.innerHeight - 120);


        const sy = Math.sqrt(Math.abs(this.dy)) * 10;
        this.element.style.paddingLeft =
            this.element.style.paddingRight = px(this.height + sy);
        this.element.style.paddingTop =
            this.element.style.paddingBottom = px(this.width - sy);

        if (this.alive && this.f > 1) {
            this.element.innerHTML = arrayRandom(score > 0 ? sadFaces : happyFaces);
            this.f = 0;
        } else if (!this.alive) {
            this.element.innerHTML = "X(";
        }
    }

    update(dt: number) {
        this.boopFor -= dt;
        this.boopX += this.boopDX * dt;
        this.boopY += this.boopDY * dt;

        this.x += this.dx * dt;
        this.y += this.dy * dt;
        this.f += this.df * dt;

        if (!this.onground) {
            // gravity
            this.dy = (this.dy + 0.1 * dt);
        }

        if (this.x <= 0 && this.dx < 0 || (this.x +
            this.element.clientWidth) >= window.innerWidth && this.dx >
            0) {
            this.dx *= -1;
        }

        if (!this.onground && (this.y + this.element.clientHeight) >=
            window.innerHeight && this.dy > 0) {
            if (this.dy > 2) {
                this.dy *= -0.5;
            } else {
                this.onground = true;
                this.dy = 0;
                if (!this.alive) {
                    this.dx = 0;
                }
            }
            play((score > 0 ? 10 : 20) + 3 * randomInt(0, 5), 0.125,
                0.05);
            shake();
        }
    }
}

customElements.define("yabs-face", FaceElement);