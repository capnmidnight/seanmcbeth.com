import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { IResponse } from "@juniper-lib/fetcher/IResponse";
import { translateResponse } from "@juniper-lib/fetcher/translateResponse";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes";
import * as allAudioTypes from "@juniper-lib/mediatypes/audio";
import { arrayInsertAt, arrayReplace, arraySortByKeyInPlace } from "@juniper-lib/collections/arrays";

export interface Voice {
    gender: 0 | 1 | 2;
    localName: string;
    locale: string;
    name: string;
    shortName: string;
    styleList: string[];
}

export interface Viseme {
    ID: number;
    Offset: number;
}

export interface SynthesisResult {
    blob: Blob;
    visemes: Viseme[];
}

export const genderNames = [
    "none",
    "female",
    "male"
];

export type Models =
    | "ada"
    | "babbage"
    | "curie"
    | "davinci"
    | "chatgpt"
    | "gpt4";

export interface ConversationLine {
    name: string;
    text: string;
}

export interface Conversation {
    prompt: string;
    messages: ConversationLine[];
    characterName: string;
    style: string;
    languageName: string;
}

export class ConversationClient {
    private readonly _voices = new Array<Voice>();
    private readonly voicesByName = new Map<string, Voice>();

    constructor(private readonly fetcher: IFetcher) {
    }

    async fetchVoices() {
        arrayReplace(this._voices, ...(await this.fetcher
            .get("/ai/conversation/voices")
            .object<Voice[]>()
            .then(unwrapResponse)));


        this.voicesByName.clear();
        for (const voice of this._voices) {
            if (voice.styleList.length > 1) {
                arrayInsertAt(voice.styleList, "", 0);
            }

            this.voicesByName.set(voice.name, voice);
        }

        arraySortByKeyInPlace(this._voices, v => v.name);
        return this._voices;
    }

    findVoice(name: string) {
        return this.voicesByName.get(name);
    }

    async textToSpeech(voice: string, style: string, text: string): Promise<IResponse<SynthesisResult>> {
        const response = await this.fetcher.post("/ai/conversation/speak")
            .body({
                voice,
                style,
                text
            }, Application_JsonUTF8)
            .blob(allAudioTypes.Audio_WebMOpus);
        return translateResponse(response, blob => {
            const visemesJSON = decodeURIComponent(response.headers.get("x-visemes"));
            const visemes = JSON.parse(visemesJSON) as Viseme[];
            return {
                blob,
                visemes
            } as SynthesisResult;
        })
    }

    async getResponse(model: Models, messages: ConversationLine[], characterName: string, style: string, languageName: string, prompt: string): Promise<IResponse<string>> {
        const input: Conversation = {
            messages,
            characterName,
            style,
            languageName,
            prompt
        };

        return await this.fetcher
            .post("/ai/conversation/" + model)
            .body(input, Application_JsonUTF8)
            .text();
    }
}
