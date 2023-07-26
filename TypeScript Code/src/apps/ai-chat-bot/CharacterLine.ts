import { AutoPlay, ClassList, Disabled, Src } from "@juniper-lib/dom/attrs";
import { border, borderColor, borderRadius, borderStyle, borderWidth, display, marginTop, position, px, right, rule, top, verticalAlign } from "@juniper-lib/dom/css";
import { onClick, onPause, onPlaying } from "@juniper-lib/dom/evts";
import { Audio, ButtonSmall, Div, ErsatzElement, Span, Style, elementSetText } from "@juniper-lib/dom/tags";
import { crossMark, pauseButton, playButton } from "@juniper-lib/emoji";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/EventBase";
import { blobToObjectURL } from "@juniper-lib/tslib/blobToObjectURL";
import { ConversationLine } from "./ConversationClient";

Style(
    rule(".character-line",
        position("relative"),
        borderStyle("dotted"),
        borderWidth(px(2)),
        borderColor("#ccc"),
        border("dotted 2px #ccc"),
        borderRadius(px(5)),
        marginTop(px(5))
    ),

    rule(".character-line > *",
        verticalAlign("middle")
    ),

    rule(".character-line > .closer",
        position("absolute"),
        right(0),
        top(0)
    )
);

export class CharacterLine
    extends TypedEventBase<{
        deleted: TypedEvent<"deleted">;
    }>
    implements ErsatzElement {
    readonly element: HTMLElement;

    private _error: string;
    private _text: string;
    private _language: string;
    private _audioBlob: Blob;
    private _audioBuffer: AudioBuffer;
    private readonly audio: HTMLMediaElement;
    private readonly playbackButton: HTMLButtonElement;
    private readonly transcript: HTMLElement;
    private readonly langOutput: HTMLElement;

    constructor(public readonly name: string, autoplay: boolean) {
        super();
        let playing = false;

        this.element = Div(
            ClassList("character-line"),
            this.playbackButton = ButtonSmall(
                ClassList("btn"),
                playButton.value,
                Disabled(true),
                onClick(() => {
                    if (playing) {
                        this.audio.pause();
                    }
                    else {
                        this.audio.play();
                    }
                })
            ),

            this.audio = Audio(
                AutoPlay(autoplay),
                display("none"),
                onPlaying(() => {
                    playing = true;
                    elementSetText(this.playbackButton, pauseButton.value);
                }),
                onPause(() => {
                    playing = false;
                    elementSetText(this.playbackButton, playButton.value);
                })
            ),

            this.langOutput = Span(name),
            Span(": "),
            this.transcript = Span(),

            ButtonSmall(
                ClassList("closer"),
                crossMark.value,
                onClick(() => this.remove())
            )
        );
    }

    remove() {
        this.dispatchEvent(new TypedEvent("deleted"));
        this.element.remove();
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
