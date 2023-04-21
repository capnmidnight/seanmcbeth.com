import { allow, disabled, frameBorder, href, htmlHeight, htmlWidth, max, min, placeHolder, scrolling, selected, src, step, target, title, value } from "@juniper-lib/dom/attrs";
import { alignSelf, color, display, em, flexDirection, fontFamily, fontSize, fontWeight, height, justifyContent, lineBreak, overflow, perc, textAlign, textDecoration, textOverflow, whiteSpace, width, wordBreak } from "@juniper-lib/dom/css";
import { onClick, onInput } from "@juniper-lib/dom/evts";
import { A, ButtonDanger, ButtonPrimary, Div, elementApply, elementClearChildren, elementSetText, Em, ErsatzElement, IFrame, Img, InputRange, Meter, Option, P, Pre, Select, TextArea } from "@juniper-lib/dom/tags";
import { arrayReplace, arraySortByKey } from "@juniper-lib/tslib/collections/arrays";
import { debounce } from "@juniper-lib/tslib/events/debounce";
import { TypedEvent, TypedEventBase } from "@juniper-lib/tslib/events/EventBase";
import { CultureDescriptions, LanguageDescriptions } from "@juniper-lib/tslib/Languages";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
import { TabPanel } from "@juniper-lib/widgets/TabPanel";
import { CharacterLine } from "./CharacterLine";
import { genderNames, Models, Viseme, Voice } from "./ConversationClient";

export class MicrophoneSelectedEvent extends TypedEvent<"microphoneselected"> {
    constructor(public readonly device: MediaDeviceInfo) {
        super("microphoneselected");
    }
}


export interface AIFormEvents {
    cultureschanged: TypedEvent<"cultureschanged">
    start: TypedEvent<"start">;
    stop: TypedEvent<"stop">;
    reprompt: TypedEvent<"reprompt">;
    reset: TypedEvent<"reset">;
    export: TypedEvent<"export">;
    microphoneselected: MicrophoneSelectedEvent;
    volumechanged: TypedEvent<"volumechanged">;
}

function embedSoundCloud(trackId: string, linkUrl: string, linkTitle: string) {
    return Div(
        IFrame(
            htmlWidth("100%"),
            htmlHeight("166"),
            scrolling(false),
            frameBorder(false),
            allow("autoplay"),
            src(`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`)
        ),
        Div(
            fontSize("10px"),
            color("#cccccc"),
            lineBreak("anywhere"),
            wordBreak("normal"),
            overflow("hidden"),
            whiteSpace("nowrap"),
            textOverflow("ellipsis"),
            fontFamily("Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif"),
            fontWeight("100"),
            A(
                color("#cccccc"),
                textDecoration("none"),
                href("https://soundcloud.com/sean-t-mcbeth"),
                title("Sean McBeth"),
                target("_blank"),
                "Sean McBeth"
            ),
            " · ",
            A(
                color("#cccccc"),
                textDecoration("none"),
                href(linkUrl),
                title(linkTitle),
                target("_blank"),
                linkTitle
            )
        )
    );
}

export class AIForm extends TypedEventBase<AIFormEvents> implements ErsatzElement {
    readonly element: HTMLElement;

    private readonly startStopButton: HTMLButtonElement;
    private readonly repromptButton: HTMLButtonElement;
    private readonly output: HTMLDivElement;
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
            elementSetText(this.startStopButton, this.listening ? "Stop listening" : "Start listening");
            this.setStatus(this.listening ? "Listening..." : "Not listening, click 'Start listening' button");
        }
    }

    private _enabled = true;
    get enabled() { return this._enabled; }
    set enabled(v) { this._enabled = v; this.refresh(); }

    get disabled() { return !this.enabled; }
    set disabled(v) { this.enabled = !v; }

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
            elementApply(cultSel, ...arraySortByKey(Array.from(cultureLookup.keys())
                .sort()
                .map((v, i) => {
                    const culture = CultureDescriptions.get(v as Culture);
                    return Option(
                        selected(defaultCulture === null && i === 0
                            || defaultCulture !== null && defaultCulture === v),
                        value(v),
                        this.getPrefix(usePrefix, voice => voice.locale === v) + (culture && culture.description || v)
                    );
                }), o => o.innerText));
        }

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
            elementApply(this.outGenderSelector, ...Array.from(genderLookup.keys())
                .sort()
                .map((v, i) => Option(
                    selected(defaultGender === null && i === 0
                        || defaultGender !== null && defaultGender === v),
                    value(v),
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
            elementApply(this.outNameSelector, ...Array.from(nameLookup.values())
                .sort((a, b) => a.localName.localeCompare(b.localName))
                .map((v, i) => Option(
                    selected(defaultName === null && i === 0
                        || defaultName !== null && defaultName === v.localName),
                    value(v.name),
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
            elementApply(this.outStyleSelector, ...voice.styleList
                .sort()
                .map((v, i) => Option(
                    selected(defaultStyle === null && i === 0
                        || defaultStyle !== null && defaultStyle === v),
                    value(v),
                    v
                )));
        };

        this.element =
            Div(
                display("flex"),
                flexDirection("column"),
                Div(
                    display("flex"),
                    flexDirection("row"),
                    justifyContent("center"),
                    this.startStopButton = ButtonPrimary(
                        onClick(() => {
                            this.dispatchEvent(this.listening ? this.stopEvt : this.startEvt);
                            this.listening = !this.listening;
                        }),
                        "Start listening"
                    ),

                    this.repromptButton = ButtonPrimary(
                        "Reprompt",
                        onClick(() => this.dispatchEvent(this.repromptEvt))
                    ),

                    this.exportButton = ButtonPrimary(
                        "Export",
                        disabled(true),
                        onClick(() => this.dispatchEvent(this.exportEvt))
                    ),

                    this.resetButton = ButtonDanger(
                        "Reset",
                        disabled(true),
                        onClick(reset)
                    )
                ),

                this.recordingStatus = Pre(
                    alignSelf("center"),
                    "Not listening, click 'Start listening'"),

                new TabPanel<"input" | "output" | "about" | "usage" | "examples">(
                    ["about", "About", Div(
                        P(`This basic AI chat-bot experiment uses Speech-to-Text technology
                           and some clever prompting of an OpenAI LLM to generate characterized 
                           responses, which are then piped out to a Text-to-Speech engine,
                           with a lip-sync visualization.`),
                        P(`I've found it to be an entertaining distraction to start conversations 
                           with the AI, change up characters, and build out fake "Podcasts" from
                           the exported audio. Check the `, Em(`"Examples tab"`), ` for links to
                           a few of them`)
                    )],

                    ["usage", "Usage", Div(
                        P(`Grant the `, Em(`Microphone Permission`), ` when the page loads. Without it, there
                           is no other way to interface with the AI.`),
                        P(`Use the `, Em(`Output tab`), ` to change characters and output language. There is
                           also an "Additional prompt" field in which you can provide extra
                           background on the conversation, like character background notes,
                           or situational details.`),
                        P(`Check the `, Em(`Input tab`), ` to make sure your microphone and language settings
                           are correct. The input language doesn't matter too much, but it's helpful
                           in the context I originally wrote this demo: building conversation
                           practice tools for learning foreign languages.`),
                        P(`Click the `, Em(`"Start listening"`), ` button to begin recording speech. The app
                           attempts to detect quiet spaces around your utterances, so you don't
                           need to click `, Em(`"Stop listening"`), ` in between each of your prompts.`),
                        P(`However, if you're in a noisy environment, or your speakers are turned
                           up too loud and your microphone ends up hearing the generated speech
                           and interprets it as your own speech, you can use the "Start/stop"
                           button to pause recording when you're done talking to avoid erroneous
                           prompt recordings`),
                        P(`The `, Em(`"Reprompt"`), ` button will force another reply from the AI without
                           requiring your verbal input.`),
                        P(`The `, Em(`"Export"`), ` button will concatenate all of the audio clips, both
                           your own and the AI's generated clips, into a single audio file,
                           which you can then do with as you wish.`)
                    )],

                    ["output", "Output", new PropertyList(
                        ["Model", this.outModelSelector = Select(
                            Option("ChatGPT 3.5", value("chatgpt"), selected(true)),
                            Option("GPT-4", value("gpt4")),
                            Option("GPT-3 Davinci", value("davinci")),
                            Option("GPT-3 Curie", value("curie")),
                            Option("GPT-3 Babbage", value("babbage")),
                            Option("GPT-3 Ada", value("ada"))
                        )],
                        ["Language", this.outLanguageSelector = Select(onInput(() => this.onOutLanguageSelected(true)))],
                        ["Culture", this.outCultureSelector = Select(onInput(() => this.onOutCultureSelected(true)))],
                        ["Gender", this.outGenderSelector = Select(onInput(() => this.onOutGenderLookup(true)))],
                        ["Voice", this.outNameSelector = Select(onInput(() => this.onOutNameLookup()))],
                        ["Style", this.outStyleSelector = Select()],
                        ["Additional prompt", this.promptInput = TextArea(
                            fontFamily("monospace"),
                            textAlign("left"),
                            height(em(5)),
                            placeHolder("Add additional prompt text here, e.g. to change instructions mid-conversation...")
                        )]
                    )],

                    ["input", "Input", new PropertyList(
                        ["Microphone", this.micSelector = Select(
                            onInput(async () => {
                                const mic = this.mics.get(this.micSelector.value);
                                this.setStatus(`Starting microphone "${mic.label}"."`);
                                this.dispatchEvent(new MicrophoneSelectedEvent(mic));
                                this.setStatus(`Microphone "${mic.label}"" started.`);
                            }))],
                        ["Audio detection", this.activityMeter = Meter(
                            min(0),
                            max(1),
                            width(perc(100))
                        )],
                        ["Volume", this.volumeInput = InputRange(
                            min(0),
                            max(1),
                            step(0.01),
                            value(1),
                            onInput(() => this.dispatchEvent(this.volumeChangedEvt))
                        )],
                        ["Language", this.inLanguageSelector = Select(onInput(() => this.onInLanguageSelected(false)))],
                        ["Culture", this.inCultureSelector = Select(onInput(() => this.onInCultureSelected()))],
                    )],

                    ["examples", "Examples", Div(
                        embedSoundCloud("1443401830", "https://soundcloud.com/sean-t-mcbeth/a-conversation-with-gpt-3", "A conversation with GPT-3"),

                        embedSoundCloud("1443481762", "https://soundcloud.com/sean-t-mcbeth/ai-podcast", "AI Podcast"),

                        embedSoundCloud("1445106046", "https://soundcloud.com/sean-t-mcbeth/conversations-with-ai", "conversations with AI")
                    )]
                ),

                this.visemeImage = Img(),

                this.output = Div(
                    fontFamily("monospace"),
                    display("inline-flex"),
                    flexDirection("column")
                )
            );
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
            const localeParts = locale.split('-');
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
            elementApply(sel,
                ...arraySortByKey(Array.from(this.languageLookup.keys())
                    .sort()
                    .map(v => {
                        const lang = LanguageDescriptions.get(v as Language);
                        return Option(
                            value(v),
                            selected(v === "en"),
                            this.getPrefix(usePrefix, voice => voice.locale.startsWith(v + "-")) + (lang && lang.description || v)
                        )
                    }), o => o.innerText));
        }

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
        elementApply(this.micSelector, ...Array.from(this.mics.values())
            .map(d => Option(
                value(d.deviceId),
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
            img.style.height = "5em";
            img.style.alignSelf = "center";
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

    addLine(line: CharacterLine) {
        elementApply(this.output, line);
        this.refresh();
    }
}
