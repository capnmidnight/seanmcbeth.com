import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { ClassList, ID } from "@juniper-lib/dom/dist/attrs";
import {
    color,
    px, scale
} from "@juniper-lib/dom/dist/css";
import { onClick } from "@juniper-lib/dom/dist/evts";
import { Button, Div, HtmlRender, P, Span, getElement } from "@juniper-lib/dom/dist/tags";
import { Beam, ScoreEvent } from "./Beam";
import { Cloud } from "./Cloud";
import { Face } from "./Face";
import { GameObject } from "./GameObject";
import "./index.css";

document.title = "No More Jabber Yabs: The Game";

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

export const NUM_YABS = Math.round(window.innerWidth / 30),
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

export let fading = false,
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

export function play(i: number, volume: number, duration: number) {
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

export function randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
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

export function shake(elem?: HTMLElement) {
    elem = elem || document.body;
    const dx = randomRange(-4, 4);
    const dy = randomRange(-4, 4);
    elem.style.transform = `translate(${px(dx)}, ${px(dy)})`;
}

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

for (let i = 0; i < NUM_YABS; ++i) {
    const yab = Face();
    yab.addEventListener("fade", onFade);
    fs.push(yab);
}

for (let i = 0; i < NUM_CLD; ++i) {
    fs.push(Cloud());
}

const beam = Beam();
beam.addEventListener("fade", onFade);
beam.addEventListener("score", (evt) => {
    if (evt instanceof ScoreEvent) {
        score += evt.delta;
        if (evt.delta === 10) {
            ++kills;
            if (kills === NUM_YABS - 2) {
                repopulateTimer = setTimeout(() => {
                    messages[2].style.display = "block";
                    scoreBox.style.display = "none";
                    beam.disable();
                }, MSG_TIMEOUT) as any;
            }
            else if (kills === NUM_YABS - 1) {
                clearTimeout(repopulateTimer);
                dystopianTimer = setTimeout(() => {
                    messages[1].style.display = "block";
                    scoreBox.style.display = "none";
                    beam.disable();
                }, MSG_TIMEOUT) as any;
            }
            else if (kills === NUM_YABS) {
                clearTimeout(dystopianTimer);
                messages[0].style.display = "block";
                scoreBox.style.display = "none";
                beam.disable();
            }
        }
    }
});
fs.push(beam);

document.body.append(...fs);

document.addEventListener("mousedown", (evt) => beam.start(evt), false);
document.addEventListener("mousemove", (evt) => {
    beam.move(evt);
    evt.preventDefault();
}, false);
document.addEventListener("mouseup", () => beam.end(), false);
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

function onFade() {
    fading = true;
}

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

export const goodEndingTimer = setTimeout(function () {
    messages[messages.length - 1].style.display = "block";
    beam.disable();
}, 15000);