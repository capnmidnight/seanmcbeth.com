import { arrayRandom } from "@juniper-lib/collections/dist/arrays";
import { ClassList } from "@juniper-lib/dom/dist/attrs";
import { backgroundColor, borderRadius, boxShadow, display, height, left, perc, position, px, rule, top, width } from "@juniper-lib/dom/dist/css";
import { Div, StyleBlob } from "@juniper-lib/dom/dist/tags";
import { EventTargetMixin } from "@juniper-lib/events/dist/EventTarget";
import { HIT_POINTS, NUM_CLD, NUM_YABS, audio, curses, fs, goodEndingTimer, play, randomInt, score, scoreBox, scoreBoxes, shake } from ".";
import { GameObject } from "./GameObject";
import { FaceElement } from "./Face";

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

export function Beam() { return document.createElement("yabs-beam") as BeamElement; }

export class ScoreEvent extends Event {
    constructor(public readonly delta: number) {
        super("score");
    }
}

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

            for (let i = 0; i < NUM_YABS; ++i) {
                const yab = fs[i];
                if (yab instanceof FaceElement && yab.alive && yab.onground) {
                    if (this.x <= yab.x + 50 && this.x + 50 >= yab.x) {
                        if (score === 0) {
                            scoreBox.style.display = "block";
                            document.body.style.backgroundImage =
                                "linear-gradient(hsl(0, 50%, 0%), hsl(0, 50%, 50%) 75%, hsl(0, 50%, 15%) 75%, hsl(0, 50%, 33%))";
                            for (let j = 0; j < NUM_CLD; ++j) {
                                const cld = fs[NUM_YABS + j];
                                for (let k = 0; k < cld.children.length; ++k) {
                                    const bit = (cld.children[k] as HTMLElement).style;
                                    bit.backgroundColor = "black";
                                }
                            }
                        }
                        this.dispatchEvent(this.#score1);
                        for (let j = 0; j < scoreBoxes.length; ++j) {
                            scoreBoxes[j].innerHTML = score.toFixed(0);
                        }
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

    #fade = new Event("fade");
    start(evt: MouseEvent | Touch) {
        audio.resume();
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