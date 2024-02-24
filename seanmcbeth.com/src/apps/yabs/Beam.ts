import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { ClassList } from "@juniper-lib/dom/dist/attrs";
import { backgroundColor, borderRadius, boxShadow, display, height, left, perc, position, px, rule, top, width } from "@juniper-lib/dom/dist/css";
import { Div, StyleBlob } from "@juniper-lib/dom/dist/tags";
import { EventTargetMixin } from "@juniper-lib/events/dist/EventTarget";
import { goodEndingTimer, play, shake } from ".";
import { FaceElement } from "./Face";
import { GameObject } from "./GameObject";
import { randomInt } from "@juniper-lib/tslib/dist/math";

const beamStyle = StyleBlob(
    rule(":host, .subBeam",
        position("absolute"),
        display("none"),
        backgroundColor("red"),
        boxShadow("0 0 25px red"),
        left(0)
    ),

    rule(":host",
        top(0),
        width(px(50)),
        height(px(50)),
        borderRadius(perc(50))
    ),

    rule(".subBeam",
        top(perc(50)),
        height(px(2000))
    )
);

export function Beam(yabs: FaceElement[], audio: JuniperAudioContext) {
    const beam = document.createElement("yabs-beam") as BeamElement;
    beam.yabs = yabs;
    beam.audio = audio;
    return beam;
}

export class ScoreEvent extends Event {
    constructor(public readonly delta: number) {
        super("score");
    }
}

const HIT_POINTS = 2,
curses = ["ow!", "yikes!", "holy cow!", "ouch!", "that smarts!",
    "ow!", "yikes!", "holy cow!", "ouch!", "that smarts!", "ow!", "yikes!",
    "holy cow!", "ouch!", "that smarts!", "mother puss-bucket!"];

class BeamElement extends HTMLElement implements GameObject {
    private subBeam: HTMLElement;
    x = 0;

    private y = 0;
    private t = 0;
    private charging = false;
    private firing = false;

    private readonly eventTarget: EventTargetMixin;

    constructor() {
        super();

        this.eventTarget = new EventTargetMixin(
            super.addEventListener.bind(this),
            super.removeEventListener.bind(this),
            super.dispatchEvent.bind(this)
        );

        this.subBeam = Div(ClassList("subBeam"));
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
        shadowRoot.append(beamStyle.cloneNode(), this.subBeam);
    }

    get disabled() { return this.hasAttribute("disabled"); }
    set disabled(v) {
        if (v) {
            this.setAttribute("disabled", "");
        }
        else {
            this.removeAttribute("disabled");
        }
    }

    disable() {
        this.disabled = true;
    }

    #score1 = new ScoreEvent(1);
    #score10 = new ScoreEvent(10);
    
    #yabs: FaceElement[] = null;
    get yabs() { return this.#yabs; }
    set yabs(v) { this.#yabs = v; }

    friendly = true;

    update(dt: number) {
        if (this.charging && this.t < 100) {
            this.t += dt;
            if (this.t >= 100) {
                this.firing = true;
                if (goodEndingTimer) {
                    clearTimeout(goodEndingTimer);
                }
            }
        } else if (!this.charging && this.t > 0) {
            this.t -= dt / 4;
            if (this.t <= 0) {
                this.firing = false;
            }
        }

        if (this.firing) {
            shake(this);
            for (let i = 0, l = this.t / 10; i < l; ++i) {
                play(87 - i, 0.02, dt / 100);
            }

            for (const yab of this.yabs) {
                if (yab instanceof FaceElement && yab.alive && yab.onground) {
                    if (this.x <= yab.x + 50 && this.x + 50 >= yab.x) {
                        this.dispatchEvent(this.#score1);
                        shake(yab);
                        ++yab.hits;
                        if (yab.hits >= HIT_POINTS) {
                            yab.alive = false;
                            this.dispatchEvent(this.#score10);
                        } else {
                            yab.style.transform += " rotate(90deg)";
                        }
                        yab.jump(arrayRandom(curses));
                        play(10 + randomInt(-1, 2), 0.1, 0.05);
                    } else if (this.x <= yab.x + 200 && this.x + 200 >= yab.x) {
                        shake(yab);
                        yab.style.transform += " rotate(90deg)";
                    }
                }
            }
        } else if (this.charging) {
            const n = Math.floor(this.t / 10) + 70;
            for (let i = 70; i < n; ++i) {
                play(i, 0.02, dt / 100);
            }
        }
    }

    render() {
        this.style.display = (this.charging || this.firing)
            ? "block"
            : "none";
        this.subBeam.style.display = this.firing
            ? "block"
            : "none";

        this.style.left = px(this.x);
        this.style.top = px(this.y);

        const c = "hsl(0, 100%, " + this.t + "%)";
        this.style.backgroundColor =
            this.subBeam.style.backgroundColor = c;
        this.style.boxShadow = this.subBeam.style.boxShadow =
            `0 0 ${px(25)} ${c}`;

        this.subBeam.style.width = this.t + "%";
        this.subBeam.style.left = (100 - this.t) / 2 + "%";
        this.subBeam.style.opacity = (this.t / 100).toFixed(3);
    }

    #audio: JuniperAudioContext = null;
    get audio() { return this.#audio; }
    set audio(v) { this.#audio = v;}

    #fade = new Event("fade");
    start(evt: MouseEvent | Touch) {
        this.audio.resume();
        this.dispatchEvent(this.#fade);
        this.x = evt.clientX - 10;
        this.y = evt.clientY - 10;
        if (!this.disabled) {
            this.charging = true;
        }
    }

    end() {
        this.style.display = "none";
        this.charging = false;
        if (!this.firing) {
            this.t = 0;
        }
    }

    move(evt: MouseEvent | Touch) {
        this.x = evt.clientX - 10;
        this.y = evt.clientY - 10;
    }
}

customElements.define("yabs-beam", BeamElement);