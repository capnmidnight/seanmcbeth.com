import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { arrayRandom } from "@juniper-lib/collections/arrays";
import { ClassList, ID } from "@juniper-lib/dom/attrs";
import {
    backgroundColor,
    backgroundImage,
    borderBottomLeftRadius, borderBottomRightRadius, borderColor, borderRadius, borderStyle, borderTopLeftRadius, borderTopRightRadius,
    borderWidth,
    boxShadow, color, deg, display, fontFamily, fontSize, fontWeight, getMonospaceFamily, height, left, overflow, padding, perc, position,
    px, rotate, rule, scale, textTransform, top, transform, width, zIndex
} from "@juniper-lib/dom/css";
import { onClick, onMouseOut, onTouchStart } from "@juniper-lib/dom/evts";
import { Button, Div, HtmlRender, HtmlTag, P, Span, StyleBlob, getElement } from "@juniper-lib/dom/tags";
import { TypedEventMap, TypedHTMLElement } from "@juniper-lib/events/TypedEventBase";

import "./styles.css";

document.title = "No More Jabber Yabs: The Game";

abstract class GameObject extends TypedHTMLElement<TypedEventMap<string>> {
    abstract update(dt: number): void;
    abstract render(): void;
    abstract get x(): number;
}

function PointDisplay() {
    return Span(ClassList("pointDisplay"), 0);
}

HtmlRender("main",
    Button(
        ID("starter"),
        "Start",
        onClick(() => audio.resume())
    ),
    Div(ID("instructions"), "Go ahead, click and hold the mouse"),
    Div(ID("scoreBox"), "GET EM: ", PointDisplay()),
    Div(ID("message0"), ClassList("endMessage"),
        P("You have killed everyone. You did it. Just you. No one else."),
        P("And why have you done this? Because you were ordered to? The pursuit of points?"),
        P("You got your points. All ", PointDisplay(), " of them. What will you do with them? There's no one left. And it's not like they took them as currency, anyway."),
        P("For no reason whatsoever, you have committed genocide against another race of people. Congratulations."),
        P("Hitler.")
    ),
    Div(ID("message1"), ClassList("endMessage"),
        P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."),
        P("There is but one person left. Did you spare them out of mercy? Or have you left them, devoid of personal contact, alone, surrounded by the burned and rotting bodies of their former loved ones, to serve as witness to your terrible deeds?"),
        P("And why have you done this? Because you were ordered to? The pursuit of points?"),
        P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's no one left. And it's not like they took them as currency, anyway."),
        P("You are sick.")
    ),
    Div(ID("message2"), ClassList("endMessage"),
        P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."),
        P("There are only two people left. Did you spare them out of mercy? Or have you left them, surrounded by the burned and rotting bodies of their former loved ones, to repopulate their world together, to serve as witness to your terrible deeds to future generations?"),
        P("And why have you done this? Because you were ordered to? The pursuit of points?"),
        P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's no one left. And it's not like they took them as currency, anyway."),
        P("I...I don't understand you."),
    ),
    Div(ID("messageN"), ClassList("endMessage"), color("black"),
        P("\"Hi there!\""),
        P("You blink. Did someone speak?"),
        P("\"Down here!\""),
        P("It's the people below."),
        P("\"We noticed you up there. What are you doing?\""),
        P("You reply, haltingly, that you do not know."),
        P("\"Oh, well, okay. Cool beans. Later!\"")
    )
);

const NUM_YABS = Math.round(window.innerWidth / 30),
    NUM_CLD = Math.round(window.innerWidth / 200),
    HIT_POINTS = 2,
    MSG_TIMEOUT = 5000,
    skins: CssColorHashValue[] = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298",
        "#FFDCB2", "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C",
        "#C67856", "#BA6C49", "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D",
        "#A8756C", "#AD6452", "#5C3836", "#CB8442", "#BD723C", "#704139",
        "#A3866A", "#870400", "#710101", "#430000", "#5B0001", "#302E2E"],
    curses = ["ow!", "yikes!", "holy cow!", "ouch!", "that smarts!",
        "ow!", "yikes!", "holy cow!", "ouch!", "that smarts!", "ow!", "yikes!",
        "holy cow!", "ouch!", "that smarts!", "mother puss-bucket!"],
    happyFaces = [":)", ":o", ":^", ":.", ":P", ":D"],
    sadFaces = [":(", ":(", ":(", ":(", ":(", ":(", ":O"],
    inst = getElement("#instructions"),
    starter = getElement("#starter"),
    scoreBox = getElement("#scoreBox"),
    scoreBoxes = document.querySelectorAll<HTMLElement>(".pointDisplay"),
    messages = document.querySelectorAll<HTMLElement>(".endMessage"),
    audio = new JuniperAudioContext(),
    out = audio.createGain(),
    fs = new Array<GameObject>(),
    osc = new Array<GainNode>(),
    timers = new Map<GainNode, number>(),
    base = Math.pow(2, 1 / 12);

let fading = false,
    scaling = 1,
    lt: number = null,
    dt = 0,
    step = 1,
    lnt = -1,
    score = 0,
    kills = 0,
    repopulateTimer: number,
    dystopianTimer: number;

function piano(n: number) {
    return 440 * Math.pow(base, n - 49);
}

function play(i: number, volume: number, duration: number) {
    const o = osc[i];
    if (o) {
        if (timers.has(o)) {
            clearTimeout(timers.get(o));
            timers.delete(o);
        }
        o.gain.value = volume;
        timers.set(o, setTimeout(() => {
            o.gain.value = 0;
            timers.delete(o);
        }, duration * 1000) as any);
    }
}

function randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
    return Math.floor(randomRange(min, max));
}

function music(t: number) {
    let nt = 0;
    if (score > 0) {
        nt = Math.floor((t / 2000) % 4) + Math.floor((t / 1000) %
            2) / 2;
    } else {
        nt = Math.floor((t / 500) % 4) + Math.floor((t / 250) % 3) /
            3;
    }

    if (lnt !== nt) {
        let len = 0.2;

        if (nt >= randomInt(0, 4)) {
            nt = Math.floor(nt);
            len /= 2;
        }
        if (score > 0) {
            const n = 25 - Math.floor(nt * 4) + randomInt(-1, 2) * 3;
            play(n, 0.04, len);
            play(n + 3, 0.04, len);
            play(n + 7, 0.04, len);
        } else {
            const n = 40 + Math.floor(nt * 3) + randomInt(-1, 2) * 4;
            play(n, 0.04, 0.05);
            play(n + randomInt(3, 5), 0.04, 0.05);
        }
    }
    lnt = nt;
}

function shake(elem?: HTMLElement) {
    elem = elem || document.body;
    const dx = randomRange(-4, 4);
    const dy = randomRange(-4, 4);
    elem.style.transform = `translate(${px(dx)}, ${px(dy)})`;
}

function isFace(obj: GameObject): obj is FaceElement {
    return obj instanceof FaceElement;
}

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

class FaceElement extends GameObject {
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

    constructor() {
        super();
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
            fading = true;
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

customElements.define("yab-face", FaceElement);

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

class CloudElement extends GameObject {
    x: number;
    private y: number;
    private dx: number;

    private readonly bits = new Array<HTMLDivElement>();

    constructor() {
        super();

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

customElements.define("yab-cloud", CloudElement);

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

class BeamElement extends GameObject {
    private subBeam: HTMLElement;
    x = 0;

    private y = 0;
    private t = 0;
    private charging = false;
    private firing = false;

    constructor() {
        super();

        this.subBeam = Div(ClassList("subBeam"));
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
                if (isFace(yab) && yab.alive && yab.onground) {
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
                        ++score;
                        for (let j = 0; j < scoreBoxes.length; ++j) {
                            scoreBoxes[j].innerHTML = score.toFixed(0);
                        }
                        shake(yab);
                        ++yab.hits;
                        if (yab.hits >= HIT_POINTS) {
                            yab.alive = false;
                            ++kills;
                            score += 10;
                            if (kills === NUM_YABS - 2) {
                                repopulateTimer = setTimeout(() => {
                                    messages[2].style.display = "block";
                                    scoreBox.style.display = "none";
                                    this.disable();
                                }, MSG_TIMEOUT) as any;
                            }
                            else if (kills === NUM_YABS - 1) {
                                clearTimeout(repopulateTimer);
                                dystopianTimer = setTimeout(() => {
                                    messages[1].style.display = "block";
                                    scoreBox.style.display = "none";
                                    this.disable();
                                }, MSG_TIMEOUT) as any;
                            }
                            else if (kills === NUM_YABS) {
                                clearTimeout(dystopianTimer);
                                messages[0].style.display = "block";
                                scoreBox.style.display = "none";
                                this.disable();
                            }
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

    start(evt: MouseEvent | Touch) {
        audio.resume();
        fading = true;
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

customElements.define("yab-beam", BeamElement);


for (let i = 0; i < 88; ++i) {
    const gn = audio.createGain();
    gn.gain.value = 0;
    const o = audio.createOscillator();
    o.frequency.value = piano(i + 1);
    o.type = "sawtooth";
    o.start();
    o.connect(gn);
    gn.connect(out);
    osc.push(gn);
}

type YabTags = {
    "yab-face": FaceElement;
    "yab-cloud": CloudElement;
    "yab-beam": BeamElement;
}

function YabTag<T extends keyof YabTags>(name: T) { return HtmlTag<T, YabTags>(name); }

function Face() { return YabTag("yab-face"); }
function Cloud() { return YabTag("yab-cloud"); }
function Beam() { return YabTag("yab-beam"); }

for (let i = 0; i < NUM_YABS; ++i) {
    fs.push(Face());
}

for (let i = 0; i < NUM_CLD; ++i) {
    fs.push(Cloud());
}

const beam = Beam();
fs.push(beam);

document.body.append(...fs);


document.addEventListener("mousedown", beam.start.bind(beam), false);
document.addEventListener("mousemove", (evt) => {
    beam.move(evt);
    evt.preventDefault();
}, false);
document.addEventListener("mouseup", beam.end.bind(beam), false);
document.addEventListener("touchstart", function (evt) {
    if (evt.touches.length === 1) {
        beam.start(evt.touches[0]);
        evt.preventDefault();
    }
}, false);
document.addEventListener("touchmove", function (evt) {
    beam.move(evt.touches[0]);
    evt.preventDefault();
}, false);
document.addEventListener("touchend", function (evt) {
    if (evt.touches.length === 0) {
        beam.end();
        evt.preventDefault();
    }
}, false);

function animate(t: number) {
    music(t);

    if (lt != null) {
        dt += (t - lt) / 10;
        while (dt >= step) {
            for (let i = 0; i < fs.length; ++i) {
                fs[i].update(step);
            }
            dt -= step;
        }
        for (let i = 0; i < fs.length; ++i) {
            fs[i].render();
        }
    }
    lt = t;
    if (fading && scaling > 0) {
        inst.style.opacity = (parseFloat(inst.style.opacity) - 0.05).toFixed(3);
        scaling -= 0.05;
        const v = Math.pow(scaling, 0.25);
        inst.style.transform = scale(v, v);
    }

    requestAnimationFrame(animate);
}


out.connect(audio.destination);
inst.style.opacity = "1";
starter.style.display = "block";

(async function () {
    await audio.ready;
    starter.style.display = "none";
    inst.style.display = "block";
    requestAnimationFrame(animate);

    setTimeout(function () {
        fading = true;
    }, 5000);
})();

const goodEndingTimer = setTimeout(function () {
    messages[messages.length - 1].style.display = "block";
    beam.disable();
}, 15000);