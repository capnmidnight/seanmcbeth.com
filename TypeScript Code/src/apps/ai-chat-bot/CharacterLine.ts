import { ClassList, Disabled, HtmlAttr, Src } from "@juniper-lib/dom/attrs";
import { backgroundColor, border, borderColor, borderRadius, borderStyle, borderWidth, cursor, display, marginTop, position, px, right, rule, top, verticalAlign } from "@juniper-lib/dom/css";
import { onClick, onPause, onPlaying } from "@juniper-lib/dom/evts";
import { Audio, ButtonSmall, HtmlTag, Span, StyleBlob, elementSetText } from "@juniper-lib/dom/tags";
import { crossMark, pauseButton, playButton } from "@juniper-lib/emoji";
import { TypedEvent, TypedHTMLElement } from "@juniper-lib/events/TypedEventBase";
import { blobToObjectURL } from "@juniper-lib/tslib/blobToObjectURL";
import { ConversationLine } from "./ConversationClient";

export function CharacterLine(name: string, autoplay: boolean) {
    return HtmlTag<"character-line", { "character-line": CharacterLineElement }>(
        "character-line",
        CharacterName(name),
        CharacterAutoPlay(autoplay)
    );
}

function CharacterName(value: string) { return new HtmlAttr("name", value, false, "character-line"); }
function CharacterAutoPlay(value: boolean) { return new HtmlAttr("autoplay", value, false, "character-line"); }

export class CharacterLineDeletedEvent extends TypedEvent<"deleted"> {
    constructor() {
        super("deleted");
    }
}

const sharedStyle = StyleBlob(
    rule(":host",
        position("relative"),
        borderStyle("dotted"),
        borderWidth(px(2)),
        borderColor("#ccc"),
        border("dotted 2px #ccc"),
        borderRadius(px(5)),
        marginTop(px(5))
    ),

    rule(":host button",
        border("none"),
        backgroundColor("transparent"),
        cursor("pointer")
    ),

    rule(":host button[disabled]",
        cursor("not-allowed")
    ),

    rule(":host > *",
        verticalAlign("middle")
    ),

    rule(":host > .closer",
        position("absolute"),
        right(0),
        top(0)
    )
);

export class CharacterLineElement extends TypedHTMLElement<{
    deleted: CharacterLineDeletedEvent;
}> {

    private _error: string = null;
    private _text: string = null;
    private _language: string = null;
    private _audioBlob: Blob = null;
    private _audioBuffer: AudioBuffer = null;
    private playing = false;

    private readonly audio: HTMLMediaElement;
    private readonly playbackButton: HTMLButtonElement;
    private readonly transcript: HTMLElement;
    private readonly langOutput: HTMLElement;

    constructor() {
        super();

        this.playbackButton = ButtonSmall(
            ClassList("btn"),
            playButton.value,
            Disabled(true),
            onClick(() => {
                if (this.playing) {
                    this.audio.pause();
                }
                else {
                    this.audio.play();
                }
            })
        );

        this.audio = Audio(
            display("none"),
            onPlaying(() => {
                this.playing = true;
                elementSetText(this.playbackButton, pauseButton.value);
            }),
            onPause(() => {
                this.playing = false;
                elementSetText(this.playbackButton, playButton.value);
            })
        );

        this.langOutput = Span();

        this.transcript = Span();

        Object.seal(this);
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.append(
            sharedStyle.cloneNode(true),
            this.playbackButton,
            this.audio,
            this.langOutput,
            Span(": "),
            this.transcript,
            ButtonSmall(
                ClassList("closer"),
                crossMark.value,
                onClick(() => this.remove())
            )
        );
    }

    override remove() {
        this.dispatchEvent(new TypedEvent("deleted"));
        super.remove();
    }

    get autoplay() { return this.hasAttribute("autoplay"); }
    set autoplay(v) {
        if (v !== this.autoplay) {
            if (v) {
                this.setAttribute("autoplay", "");
                this.audio.setAttribute("autoplay", "");
            }
            else {
                this.removeAttribute("autoplay");
                this.audio.removeAttribute("autoplay");
            }
        }
    }

    get name() { return this.getAttribute("name"); }
    set name(v: string) {
        this.setAttribute("name", v);
        this.langOutput.textContent = v;
    }

    get error() { return this._error; }
    set error(v) { elementSetText(this.transcript, this._error = v); }

    get language() { return this._language; }
    set language(v) { elementSetText(this.langOutput, `${this.name} (${this._language = v})`); }

    get text() { return this._text; }
    set text(v) { elementSetText(this.transcript, this._text = v); }

    get contextLine(): ConversationLine {
        return {
            name: this.name,
            text: this.text
        };
    }

    get audioBlob() { return this._audioBlob; }
    async setAudioBlob(ctx: AudioContext, v: Blob) {
        if (v !== this.audioBlob) {
            this._audioBlob = v;
            const array = await v.arrayBuffer();
            this._audioBuffer = await ctx.decodeAudioData(array);
            Src(blobToObjectURL(this.audioBlob)).applyToElement(this.audio);
            this.playbackButton.disabled = false;
        }
    }

    get audioBuffer() { return this._audioBuffer; }

    get duration() { return this.audioBuffer.duration; }

    getVttEntry(startTime: number, showHours: boolean) {
        const start = splitTime(startTime, showHours);
        const end = splitTime(startTime + this.duration, showHours);
        return `${start} --> ${end}\n<v ${this.name}>${this.text}\n`;
    }
}

customElements.define("character-line", CharacterLineElement);

function splitTime(time: number, showHours: boolean) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;

    let hoursSt = hours.toString();
    let minutesSt = minutes.toString();
    let secondsSt = seconds.toFixed(3);

    if (hours < 10) {
        hoursSt = "0" + hoursSt;
    }
    if (minutes < 10) {
        minutesSt = "0" + minutesSt;
    }
    if (seconds < 10) {
        secondsSt = "0" + secondsSt;
    }

    const parts = new Array<string>();
    if (showHours) {
        parts.push(hoursSt);
    }

    parts.push(minutesSt, secondsSt);
    return parts.join(":");
}
