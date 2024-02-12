import { ActivityDetector } from "@juniper-lib/audio/dist/ActivityDetector";
import { AudioManager } from "@juniper-lib/audio/dist/AudioManager";
import { DeviceManager } from "@juniper-lib/audio/dist/DeviceManager";
import { LocalUserMicrophone } from "@juniper-lib/audio/dist/LocalUserMicrophone";
import { audioBufferToWav } from "@juniper-lib/audio/dist/audioBufferToWav";
import { arrayClear, arrayRemove } from "@juniper-lib/collections/dist/arrays";
import { all } from "@juniper-lib/events/dist/all";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes";
import { AzureSpeechRecognizer } from "@juniper-lib/speech/dist/AzureSpeechRecognizer";
import { CultureDescriptions } from "@juniper-lib/tslib/dist/Languages";
import { blobToObjectURL } from "@juniper-lib/tslib/dist/blobToObjectURL";
import { makeErrorMessage } from "@juniper-lib/tslib/dist/makeErrorMessage";
import { createFetcher } from "../../createFetcher";
import { AIForm } from "./AIForm";
import { CharacterLine, CharacterLineElement } from "./CharacterLine";
import { ConversationClient, Models } from "./ConversationClient";
import "./index.css";

(async function () {
    const form = new AIForm();
    const fetcher = createFetcher();
    const audio = new AudioManager(fetcher, "localuser");
    const microphones = new LocalUserMicrophone(audio.context);
    const devMgr = new DeviceManager(microphones);
    const activity = new ActivityDetector(audio.context);
    const [subKey, region] = await fetcher.get("/ai/conversation/token")
        .object<[string, string]>(Application_JsonUTF8)
        .then(unwrapResponse);
    const recognizer = new AzureSpeechRecognizer(subKey, region, microphones, activity);
    const conversation = new ConversationClient(fetcher);
    const orderedLines = new Array<CharacterLineElement>();
    const characterLines = new Map<number, CharacterLineElement>();

    form.enabled = false;

    form.status = "Initializing audio system";

    await devMgr.init();

    form.addEventListener("volumechanged", () => microphones.gain.value = form.volume);
    form.addEventListener("reset", () => {
        arrayClear(orderedLines);
        characterLines.clear();
    });
    form.addEventListener("start", () => recognizer.start());
    form.addEventListener("stop", () => recognizer.stop());
    form.addEventListener("export", exportAudio);

    form.addEventListener("reprompt", () => {
        const culture = CultureDescriptions.get(form.inputCulture);
        prompt(form.outputModel, culture.language.localName);
    });

    form.addEventListener("cultureschanged", () => {
        const inCulture = CultureDescriptions.get(form.inputCulture);
        if (inCulture) {
            recognizer.speakerCulture = inCulture.tag;
        }

        const outCulture = CultureDescriptions.get(form.outputCulture);
        if (outCulture) {
            recognizer.targetCulture = outCulture.tag;
        }
    });

    form.addEventListener("microphoneselected", async (evt) => {
        form.enabled = false;
        await microphones.setDevice(evt.device);
        form.enabled = true;
    });

    microphones.enabled = true;
    microphones.connect(activity);

    activity.addEventListener("activity", (evt) => requestAnimationFrame(() => form.activityLevel = evt.level));
    activity.start();

    recognizer.continuous = true;
    recognizer.addEventListener("speechstart", () => form.setStatus("Recording"));
    recognizer.addEventListener("blobavailable", (evt) => startLine(evt.id, evt.blob));
    recognizer.addEventListener("error", (evt) => cancelLine(evt.id, `[${evt.error}] ${evt.message}`));
    recognizer.addEventListener("nomatch", (evt) => cancelLine(evt.id, "no result"));
    recognizer.addEventListener("result", (evt) => finishLine(evt.id, evt.results, evt.culture, evt.isFinal));
    recognizer.addEventListener("end", () => form.listening = false);

    form.status = "Loading...";

    const [images, voices, devices] = await all(
        getImagesAsync(),
        conversation.fetchVoices(),
        devMgr.getDevices(true)
    );

    form.setVisemeImages(images);
    form.setVoices(voices);
    form.setMicrophones(devices.filter(d => d.kind === "audioinput"));
    form.setCurrentMic(microphones.device);
    form.enabled = true;

    Object.assign(window, { aiform: form });

    form.status = "Ready. Click 'Start'";

    async function exportAudio() {
        form.enabled = false;
        try {
            const lines = Array.from(orderedLines);
            const sampleRate = 44100;
            const numberOfChannels = 2;
            const characterPositions = new Map<string, number>();
            let totalDuration = 0;
            for (const line of lines) {
                if (line) {
                    totalDuration += line.duration + 0.25;
                    characterPositions.set(line.name, 0);
                }
            }

            if (characterPositions.size > 1) {
                let i = 0;
                for (const name of characterPositions.keys()) {
                    const pos = (i / (characterPositions.size - 1)) - 0.5;
                    characterPositions.set(name, pos);
                    ++i;
                }
            }

            const length = Math.ceil(sampleRate * totalDuration);

            const ctx = new OfflineAudioContext({
                length,
                numberOfChannels,
                sampleRate
            });

            let accumDuration = 0;

            for (let i = 0; i < lines.length; ++i) {
                const line = lines[i];
                if (line) {
                    const node = new AudioBufferSourceNode(ctx, {
                        buffer: line.audioBuffer
                    });
                    let here: AudioNode = node;
                    if (here.channelCount > 1) {
                        const splitter = new ChannelSplitterNode(ctx, {
                            numberOfOutputs: here.channelCount
                        });
                        node.connect(splitter);

                        const combiner = new GainNode(ctx, {
                            channelCount: 1
                        });
                        for (let j = 0; j < splitter.numberOfOutputs; ++j) {
                            splitter.connect(combiner, j);
                        }

                        here = combiner;
                    }

                    const panner = new StereoPannerNode(ctx, {
                        pan: characterPositions.get(line.name)
                    });

                    here.connect(panner);
                    panner.connect(ctx.destination);

                    node.start(accumDuration);
                    accumDuration += line.duration + 0.25;
                }
            }

            const data = await ctx.startRendering();

            const waveBlob = audioBufferToWav(data);
            window.open(blobToObjectURL(waveBlob), "_blank");
        }
        catch (exp) {
            console.error(exp);
            form.setStatus(makeErrorMessage("Export failed: $1", exp));
        }
        finally {
            form.enabled = true;
        }
    }

    async function getImagesAsync() {
        const imagePaths = new Array<string>(22);
        for (let i = 0; i < 22; ++i) {
            imagePaths[i] = `/img/visemes/${i}.png`;
        }

        return await Promise.all(imagePaths.map(path =>
            fetcher.get(path)
                .image()
                .then(unwrapResponse)));
    }

    function assureLine(id: number): CharacterLineElement {
        if (!characterLines.has(id)) {
            const line = CharacterLine("Me", false);
            characterLines.set(id, line);
            form.addLine(line);
            orderedLines.push(line);
        }
        return characterLines.get(id);
    }

    async function startLine(id: number, blob: Blob) {
        const line1 = assureLine(id);
        await line1.setAudioBlob(audio.context, blob);
    }

    function cancelLine(id: number, reason: string) {
        const line1 = assureLine(id);
        form.setStatus("Couldn't recognize speech");
        if (reason === "no result") {
            arrayRemove(orderedLines, line1);
            characterLines.delete(id);
            line1.remove();
        }
        else {
            line1.error = reason;
        }
    }

    async function finishLine(id: number, text: string, cult: Culture, isFinal: boolean) {
        const culture = CultureDescriptions.get(cult);
        const line1 = assureLine(id);
        line1.addEventListener("deleted", () => {
            arrayRemove(orderedLines, line1);
            characterLines.delete(id);
        });
        form.setStatus("Speech recognized");
        if (culture) {
            form.inputLanguage = culture.language.tag;
            form.inputCulture = culture.tag;
            line1.language = culture.tag;
        }
        line1.text = text;
        if (isFinal) {
            await prompt(form.outputModel, culture && culture.language && culture.language.localName || "en-US");
        }
    }

    let counter = 0;
    async function prompt(modelName: Models, languageName: string) {
        const ttsVoice = conversation.findVoice(form.outputVoiceName);
        const voice = ttsVoice.shortName;
        const characterName = ttsVoice.localName;
        const line2 = CharacterLine(characterName, true);
        const id = --counter;
        orderedLines.push(line2);
        characterLines.set(id, line2);
        line2.addEventListener("deleted", () => {
            arrayRemove(orderedLines, line2);
            characterLines.delete(id);
        });

        form.addLine(line2);

        form.setStatus("Getting response");

        const lines = Array.from(orderedLines);
        const messages = lines.map(l => l.contextLine);
        const style = form.outputVoiceStyle;
        const prompt = form.additionalPrompt;

        const ai = await conversation.getResponse(modelName, messages, characterName, style, languageName, prompt);

        const generatedText = ai.content;

        if (!generatedText) {
            line2.error = ai.status < 400
                ? "no result"
                : "response error";
            form.setStatus("Couldn't generate response");
            line2.remove();
        }
        else {
            line2.text = generatedText;
            const tts = await conversation.textToSpeech(voice, style, generatedText);
            await line2.setAudioBlob(audio.context, tts.content.blob);
            form.visemeAnimate(tts.content.visemes);
        }

        form.setStatus("Complete");
    }
})();