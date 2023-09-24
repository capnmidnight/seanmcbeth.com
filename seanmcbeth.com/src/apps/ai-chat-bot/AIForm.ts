import { arrayReplace, compareBy } from "@juniper-lib/collections/dist/arrays";
import { ID, Max, Min, Selected, Step, Value } from "@juniper-lib/dom/dist/attrs";
import { onClick, onInput } from "@juniper-lib/dom/dist/evts";
import { ButtonDanger, ButtonPrimary, DD, HtmlRender, Img, InputRange, Meter, Option, Pre, Select, TextArea, elementClearChildren, elementGetText, elementSetText, getElements } from "@juniper-lib/dom/dist/tags";
import { TypedEvent, TypedEventTarget } from "@juniper-lib/events/dist/TypedEventTarget";
import { debounce } from "@juniper-lib/events/dist/debounce";
import { CultureDescriptions, LanguageDescriptions } from "@juniper-lib/tslib/dist/Languages";
import { PropertyList } from "@juniper-lib/widgets/dist/PropertyList";
import "@juniper-lib/widgets/dist/TabPanel";
import { CharacterLineElement } from "./CharacterLine";
import { Models, Viseme, Voice, genderNames } from "./ConversationClient";

export class MicrophoneSelectedEvent extends TypedEvent<"microphoneselected"> {
    constructor(public readonly device: MediaDeviceInfo) {
        super("microphoneselected");
    }
}


export type AIFormEvents =  {
    cultureschanged: TypedEvent<"cultureschanged">
    start: TypedEvent<"start">;
    stop: TypedEvent<"stop">;
    reprompt: TypedEvent<"reprompt">;
    reset: TypedEvent<"reset">;
    export: TypedEvent<"export">;
    microphoneselected: MicrophoneSelectedEvent;
    volumechanged: TypedEvent<"volumechanged">;
}

PropertyList.find();

const elementComparer = compareBy<HTMLElement>("ascending", o => o.innerText);

export class AIForm extends TypedEventTarget<AIFormEvents> {

    private readonly startStopButton: HTMLButtonElement;
    private readonly repromptButton: HTMLButtonElement;
    private readonly output: HTMLElement;
    private readonly resetButton: HTMLButtonElement;
    private readonly exportButton: HTMLButtonElement;
    private readonly recordingStatus: HTMLPreElement;
    private readonly micSelector: HTMLSelectElement;
    private readonly activityMeter: HTMLMeterElement;
    private readonly volumeInput: HTMLInputElement;
    private readonly promptInput: HTMLTextAreaElement;
    private readonly inLanguageSelector: HTMLSelectElement;
    private readonly inCultureSelector: HTMLSelectElement;
    private readonly outModelSelector: HTMLSelectElement;
    private readonly outLanguageSelector: HTMLSelectElement;
    private readonly outCultureSelector: HTMLSelectElement;
    private readonly outGenderSelector: HTMLSelectElement;
    private readonly outNameSelector: HTMLSelectElement;
    private readonly outStyleSelector: HTMLSelectElement;
    private visemeImage: HTMLImageElement;

    private _listening = false;
    get listening() { return this._listening; }
    set listening(v) {
        if (v !== this.listening) {
            this._listening = v;
            elementSetText(this.startStopButton, this.listening ? "Stop" : "Start");
            this.setStatus(this.listening ? "Listening..." : "Not listening, click 'Start' button");
        }
    }

    private _enabled = true;
    get enabled() { return this._enabled; }
    set enabled(v) { this._enabled = v; this.refresh(); }

    get disabled() { return !this.enabled; }
    set disabled(v) { this.enabled = !v; }

    get status() { return elementGetText(this.recordingStatus); }
    set status(v: string) { elementSetText(this.recordingStatus, v); }

    get volume() { return this.volumeInput.valueAsNumber; }

    get activityLevel() { return this.activityMeter.value; }
    set activityLevel(v) { this.activityMeter.value = v; }

    get additionalPrompt() { return this.promptInput.value; }

    get inputLanguage() { return this.inLanguageSelector.value as Language; }
    set inputLanguage(v: Language) { this.inLanguageSelector.value = v; }

    get inputCulture() { return this.inCultureSelector.value as Culture; }
    set inputCulture(v: Culture) { this.inCultureSelector.value = v; }


    get outputModel() { return this.outModelSelector.value as Models; }
    get outputLanguage() { return this.outLanguageSelector.value as Language; }
    get outputCulture() { return this.outCultureSelector.value as Culture; }
    get outputVoiceName() { return this.outNameSelector.value; }
    get outputVoiceStyle() { return this.outStyleSelector.value; }

    private readonly culturesChangedEvt = new TypedEvent("cultureschanged");
    private readonly startEvt = new TypedEvent("start");
    private readonly stopEvt = new TypedEvent("stop");
    private readonly repromptEvt = new TypedEvent("reprompt");
    private readonly resetEvt = new TypedEvent("reset");
    private readonly exportEvt = new TypedEvent("export");
    private readonly volumeChangedEvt = new TypedEvent("volumechanged");

    private readonly refresh: () => void;
    private readonly onInLanguageSelected: (usePrefix: boolean, defaultCulture?: string) => void;
    private readonly onInCultureSelected: () => void;
    private readonly onOutLanguageSelected: (usePrefix: boolean, defaultCulture?: string, defaultGender?: string, defaultName?: string, defaultStyle?: string) => void;
    private readonly onOutCultureSelected: (usePrefix: boolean, defaultGender?: string, defaultName?: string, defaultStyle?: string) => void;
    private readonly onOutGenderLookup: (usePrefix: boolean, defaultName?: string, defaultStyle?: string) => void;
    private readonly onOutNameLookup: (defaulStyle?: string) => void;

    private readonly mics = new Map<string, MediaDeviceInfo>();
    private readonly voices = new Array<Voice>();
    private readonly languageLookup = new Map<Language, Map<string, Map<string, Map<string, Voice>>>>();
    private readonly visemeImages = new Array<HTMLImageElement>();

    constructor() {
        super();

        this.refresh = debounce(this._refresh.bind(this));

        const reset = () => {
            this.dispatchEvent(this.resetEvt);
            elementClearChildren(this.output);
            this.refresh();
        };

        const displayCulture = (usePrefix: boolean, langSel: HTMLSelectElement, cultSel: HTMLSelectElement, defaultCulture?: string) => {
            const cultureLookup = this.languageLookup.get(langSel.value as Language);
            elementClearChildren(cultSel);
            HtmlRender(cultSel, ...Array.from(cultureLookup.keys())
                .map((v, i) => {
                    const culture = CultureDescriptions.get(v as Culture);
                    return Option(
                        Selected(defaultCulture === null && i === 0
                            || defaultCulture !== null && defaultCulture === v),
                        Value(v),
                        this.getPrefix(usePrefix, voice => voice.locale === v) + (culture && culture.description || v)
                    );
                }).sort(elementComparer));
        };

        this.onInLanguageSelected = (usePrefix: boolean, defaultCulture?: string) => {
            displayCulture(usePrefix, this.inLanguageSelector, this.inCultureSelector, defaultCulture);
            this.onInCultureSelected();
        };

        this.onOutLanguageSelected = (usePrefix: boolean, defaultCulture?: string, defaultGender?: string, defaultName?: string, defualtStyle?: string) => {
            displayCulture(usePrefix, this.outLanguageSelector, this.outCultureSelector, defaultCulture);
            this.onOutCultureSelected(usePrefix, defaultGender, defaultName, defualtStyle);
        };

        this.onInCultureSelected = () => {
            this.dispatchEvent(this.culturesChangedEvt);
        };

        this.onOutCultureSelected = (usePrefix: boolean, defaultGender?: string, defaultName?: string, defaultStyle?: string) => {
            const cultureLookup = this.languageLookup.get(this.outLanguageSelector.value as Language);
            const genderLookup = cultureLookup.get(this.outCultureSelector.value);
            elementClearChildren(this.outGenderSelector);
            HtmlRender(this.outGenderSelector, ...Array.from(genderLookup.keys())
                .sort()
                .map((v, i) => Option(
                    Selected(defaultGender === null && i === 0
                        || defaultGender !== null && defaultGender === v),
                    Value(v),
                    this.getPrefix(usePrefix, voice => voice.locale === this.outCultureSelector.value
                        && v === genderNames[voice.gender]) + v
                )));
            this.dispatchEvent(this.culturesChangedEvt);
            this.onOutGenderLookup(usePrefix, defaultName, defaultStyle);
        };

        this.onOutGenderLookup = (usePrefix: boolean, defaultName: string = null, defaultStyle: string = null) => {
            const cultureLookup = this.languageLookup.get(this.outLanguageSelector.value as Language);
            const genderLookup = cultureLookup.get(this.outCultureSelector.value);
            const nameLookup = genderLookup.get(this.outGenderSelector.value);
            elementClearChildren(this.outNameSelector);
            HtmlRender(this.outNameSelector, ...Array.from(nameLookup.values())
                .sort((a, b) => a.localName.localeCompare(b.localName))
                .map((v, i) => Option(
                    Selected(defaultName === null && i === 0
                        || defaultName !== null && defaultName === v.localName),
                    Value(v.name),
                    this.getPrefix(usePrefix, voice => v === voice) + v.localName
                )));
            this.onOutNameLookup(defaultStyle);
        };

        this.onOutNameLookup = (defaultStyle: string = null) => {
            const cultureLookup = this.languageLookup.get(this.outLanguageSelector.value as Language);
            const genderLookup = cultureLookup.get(this.outCultureSelector.value);
            const nameLookup = genderLookup.get(this.outGenderSelector.value);
            const voice = nameLookup.get(this.outNameSelector.value);
            elementClearChildren(this.outStyleSelector);
            HtmlRender(this.outStyleSelector, ...voice.styleList
                .sort()
                .map((v, i) => Option(
                    Selected(defaultStyle === null && i === 0
                        || defaultStyle !== null && defaultStyle === v),
                    Value(v),
                    v
                )));
        };

        this.startStopButton = ButtonPrimary(
            ID("startStop"),
            onClick(() => {
                this.dispatchEvent(this.listening ? this.stopEvt : this.startEvt);
                this.listening = !this.listening;
            })
        );

        this.repromptButton = ButtonPrimary(
            ID("reprompt"),
            onClick(() => this.dispatchEvent(this.repromptEvt))
        );

        this.exportButton = ButtonPrimary(
            ID("export"),
            onClick(() => this.dispatchEvent(this.exportEvt))
        );

        this.resetButton = ButtonDanger(
            ID("reset"),
            onClick(reset)
        );

        this.recordingStatus = Pre(ID("status"));

        this.outModelSelector = Select(
            ID("outModel"),
            Option("ChatGPT 3.5", Value("chatgpt"), Selected(true)),
            Option("GPT-4", Value("gpt4")),
            Option("GPT-3 Davinci", Value("davinci")),
            Option("GPT-3 Curie", Value("curie")),
            Option("GPT-3 Babbage", Value("babbage")),
            Option("GPT-3 Ada", Value("ada"))
        );

        this.outLanguageSelector = Select(
            ID("outLanguage"),
            onInput(() => this.onOutLanguageSelected(true))
        );

        this.outCultureSelector = Select(
            ID("outCulture"),
            onInput(() => this.onOutCultureSelected(true))
        );

        this.outGenderSelector = Select(
            ID("outGender"),
            onInput(() => this.onOutGenderLookup(true))
        );

        this.outNameSelector = Select(
            ID("outVoice"),
            onInput(() => this.onOutNameLookup())
        );

        this.outStyleSelector = Select(ID("outStyle"));

        this.promptInput = TextArea(ID("addlPrompt"));

        this.micSelector = Select(
            ID("inMic"),
            onInput(async () => {
                const mic = this.mics.get(this.micSelector.value);
                this.setStatus(`Starting microphone "${mic.label}"."`);
                this.dispatchEvent(new MicrophoneSelectedEvent(mic));
                this.setStatus(`Microphone "${mic.label}"" started.`);
            })
        );

        this.activityMeter = Meter(
            ID("micActivity"),
            Min(0),
            Max(1)
        );

        this.volumeInput = InputRange(
            ID("inVolume"),
            Min(0),
            Max(1),
            Step(0.01),
            Value(1),
            onInput(() => this.dispatchEvent(this.volumeChangedEvt))
        );

        this.inLanguageSelector = Select(
            ID("inLanguage"),
            onInput(() => this.onInLanguageSelected(false))
        );

        this.inCultureSelector = Select(
            ID("inCulture"),
            onInput(() => this.onInCultureSelected())
        );

        this.visemeImage = Img(ID("visemes"));

        this.output = DD(ID("conversationLog"));

        const vibrate = () => navigator.vibrate(25);
        for (const btn of getElements<HTMLButtonElement>(".btn")) {
            btn.addEventListener("click", vibrate);
        }
    }

    private getPrefix(usePrefix: boolean, filterVoice: (voice: Voice) => boolean) {
        const hasStyles = this.voices
            .filter(v => filterVoice(v)
                && v.styleList.filter(s => s.length > 0).length > 0).length > 0;
        return (usePrefix && hasStyles ? "* " : "");
    }

    private _refresh() {
        const disable = this.listening || this.disabled;
        this.micSelector.disabled = this.mics.size < 2 || disable;
        this.resetButton.disabled
            = this.exportButton.disabled
            = this.output.childElementCount === 0;

        this.startStopButton.disabled
            = this.repromptButton.disabled
            = this.promptInput.disabled
            = this.inLanguageSelector.disabled
            = this.inCultureSelector.disabled
            = this.outStyleSelector.disabled
            = this.outNameSelector.disabled
            = this.outGenderSelector.disabled
            = this.outCultureSelector.disabled
            = this.outLanguageSelector.disabled
            = this.outModelSelector.disabled
            = this.volumeInput.disabled
            = this.disabled;
    }

    setVoices(voices: Voice[]) {
        arrayReplace(this.voices, ...voices);
        this.languageLookup.clear();

        for (const voice of voices) {
            const { locale, gender, name } = voice;
            const localeParts = locale.split("-");
            const language = localeParts[0] as Language;
            if (!this.languageLookup.has(language)) {
                this.languageLookup.set(language, new Map());
            }

            const cultureLookup = this.languageLookup.get(language);
            if (!cultureLookup.has(locale)) {
                cultureLookup.set(locale, new Map());
            }

            const genderLookup = cultureLookup.get(locale);
            if (!genderLookup.has(genderNames[gender])) {
                genderLookup.set(genderNames[gender], new Map());
            }

            const nameLookup = genderLookup.get(genderNames[gender]);
            nameLookup.set(name, voice);
        }

        const displayLanguages = (usePrefix: boolean, sel: HTMLSelectElement) => {
            elementClearChildren(sel);
            HtmlRender(sel,
                ...Array.from(this.languageLookup.keys())
                    .map(v => {
                        const lang = LanguageDescriptions.get(v as Language);
                        return Option(
                            Value(v),
                            Selected(v === "en"),
                            this.getPrefix(usePrefix, voice => voice.locale.startsWith(v + "-")) + (lang && lang.description || v)
                        );
                    }).sort(elementComparer));
        };

        displayLanguages(false, this.inLanguageSelector);
        this.onInLanguageSelected(false, "en-US");

        displayLanguages(true, this.outLanguageSelector);
        this.onOutLanguageSelected(true, "en-US", "female", "Jenny", "excited");
    }

    setMicrophones(devices: MediaDeviceInfo[]) {
        this.mics.clear();
        for (const d of devices) {
            this.mics.set(d.deviceId, d);
        }

        elementClearChildren(this.micSelector);
        HtmlRender(this.micSelector, ...Array.from(this.mics.values())
            .map(d => Option(
                Value(d.deviceId),
                d.label || d.groupId
            )));
    }

    setCurrentMic(curMic: MediaDeviceInfo) {
        for (const option of this.micSelector.options) {
            option.selected = curMic && option.value === curMic.deviceId;
        }
    }

    setStatus(status: string) {
        elementSetText(this.recordingStatus, status);
    }

    setVisemeImages(images: HTMLImageElement[]) {
        arrayReplace(this.visemeImages, ...images);
        for (const img of this.visemeImages) {
            img.id = "visemes";
        }
    }

    visemeAnimate(visemes: Viseme[]) {
        for (const viseme of visemes) {
            setTimeout(() =>
                this.setViseme(viseme.ID),
            viseme.Offset * 1000);
        }
    }

    private setViseme(id: number) {
        const newImage = this.visemeImages[id];
        this.visemeImage.replaceWith(newImage);
        this.visemeImage = newImage;
    }

    addLine(line: CharacterLineElement) {
        HtmlRender(this.output, line);
        this.refresh();
    }
}
