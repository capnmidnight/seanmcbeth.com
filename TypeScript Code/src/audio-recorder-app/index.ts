import { AudioManager } from "@juniper-lib/audio/AudioManager";
import { MicrophoneManager } from "@juniper-lib/audio/MicrophoneManager";
import { controls, href, src, value } from "@juniper-lib/dom/attrs";
import { A, Audio, BR, Button, elementApply, elementSetText, Option, Select } from "@juniper-lib/dom/tags";
import * as _allAudio from "@juniper-lib/mediatypes/audio";
import { blobToDataURL } from "@juniper-lib/tslib/blobToDataURL";
import { blobToObjectURL } from "@juniper-lib/tslib/blobToObjectURL";
import { arrayClear } from "@juniper-lib/tslib/collections/arrays";
import { once } from "@juniper-lib/tslib/events/once";
import { sleep } from "@juniper-lib/tslib/events/sleep";
import { createFetcher } from "../createFetcher";
import { tilReady } from "../createTestEnvironment";

const fetcher = createFetcher();
const audio = new AudioManager(fetcher, "localuser");
const microphones = new MicrophoneManager();
const chunks = new Array<Blob>();
const startStop = Button("Start");
const supportedTypes = Object
    .values(_allAudio)
    .map(v => v.value)
    .filter(MediaRecorder.isTypeSupported);
const options = supportedTypes
    .map(v => Option(value(v), v));
const types = Select(...options);

elementApply("main", types, BR(), startStop);

(async function () {
    await tilReady(audio);
    await microphones.ready;

    while (true) {
        await once<HTMLElementEventMap>(startStop, "click");
        startStop.disabled = true;

        await microphones.startPreferredAudioInput();

        const recorder = new MediaRecorder(microphones.currentStream, {
            mimeType: types.value
        });

        recorder.addEventListener("start", () => {
            arrayClear(chunks);
        });

        recorder.addEventListener("dataavailable", (evt) => {
            chunks.push(evt.data);
        });

        const doneTask = once<MediaRecorderEventMap>(recorder, "stop");

        recorder.start();
        startStop.disabled = false;
        elementSetText(startStop, "Stop");

        await once<HTMLElementEventMap>(startStop, "click");
        startStop.disabled = true;
        await sleep(250);
        recorder.stop();
        await doneTask;

        const blob = new Blob(chunks, {
            type: recorder.mimeType
        });
        const url = blobToObjectURL(blob);
        const base64 = await blobToDataURL(blob);

        console.log(url, base64);
        const aud = Audio(src(url), controls(true));
        const link = A(href(url), "download");
        console.log({ aud });
        document.body.append(BR(), aud, link);

        elementSetText(startStop, "Start");
        startStop.disabled = false;
    }
})();