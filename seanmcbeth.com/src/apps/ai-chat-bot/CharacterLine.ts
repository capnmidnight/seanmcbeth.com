import { ClassList, Disabled, HtmlAttr, Src } from "@juniper-lib/dom/dist/attrs";
import { backgroundColor, border, borderColor, borderRadius, borderStyle, borderWidth, cursor, display, marginTop, position, px, right, rule, top, verticalAlign } from "@juniper-lib/dom/dist/css";
import { onClick, onPause, onPlaying } from "@juniper-lib/dom/dist/evts";
import { Audio, ButtonSmall, HtmlRender, Span, StyleBlob, elementSetText } from "@juniper-lib/dom/dist/tags";
import { crossMark, pauseButton, playButton } from "@juniper-lib/emoji";
import { ITypedEventTarget, TypedEvent, TypedEventListenerOrEventListenerObject } from "@juniper-lib/events/dist/TypedEventTarget";
import { blobToObjectURL } from "@juniper-lib/tslib/dist/blobToObjectURL";
import { ConversationLine } from "./ConversationClient";
import { EventTargetMixin } from "@juniper-lib/events/dist/EventTarget";

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

type CharacterLineElementEvents = {
    deleted: CharacterLineDeletedEvent;
};

export function CharacterLine(name: string, autoplay: boolean) {
    return HtmlRender(
        document.createElement("character-line"),
        "character-line",
        CharacterName(name),
        CharacterAutoPlay(autoplay)
    ) as CharacterLineElement;
}

export class CharacterLineElement extends HTMLElement implements ITypedEventTarget<CharacterLineElementEvents> {
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
    private readonly eventTarget: EventTargetMixin;

    constructor() {
        super();

        this.eventTarget = new EventTargetMixin(
            super.addEventListener.bind(this),
            super.removeEventListener.bind(this),
            super.dispatchEvent.bind(this)
        );

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

    override addEventListener<EventTypeT extends keyof CharacterLineElementEvents>(type: EventTypeT, callback: TypedEventListenerOrEventListenerObject<CharacterLineElementEvents, EventTypeT>, options?: boolean | AddEventListenerOptions): void {
        this.eventTarget.addEventListener(type as string, callback as EventListenerOrEventListenerObject, options);
    }

    override removeEventListener<EventTypeT extends keyof CharacterLineElementEvents>(type: EventTypeT, callback: TypedEventListenerOrEventListenerObject<CharacterLineElementEvents, EventTypeT>): void {
        this.eventTarget.removeEventListener(type as string, callback as EventListenerOrEventListenerObject);
    }

    override dispatchEvent(evt: Event): boolean {
        return this.eventTarget.dispatchEvent(evt);
    }

    addBubbler(bubbler: ITypedEventTarget<CharacterLineElementEvents>): void {
        this.eventTarget.addBubbler(bubbler);
    }

    removeBubbler(bubbler: ITypedEventTarget<CharacterLineElementEvents>): void {
        this.eventTarget.removeBubbler(bubbler);
    }

    addScopedEventListener<EventTypeT extends keyof CharacterLineElementEvents>(scope: object, type: EventTypeT, callback: TypedEventListenerOrEventListenerObject<CharacterLineElementEvents, EventTypeT>, options?: boolean | AddEventListenerOptions): void {
        this.eventTarget.addScopedEventListener(scope, type as string, callback as EventListenerOrEventListenerObject, options);
    }

    removeScope(scope: object) {
        this.eventTarget.removeScope(scope);
    }

    clearEventListeners<EventTypeT extends keyof CharacterLineElementEvents>(type?: EventTypeT): void {
        this.eventTarget.clearEventListeners(type as string);
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
