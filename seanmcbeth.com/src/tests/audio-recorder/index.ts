import { ActivityDetector } from "@juniper-lib/audio/dist/ActivityDetector";
import { AudioManager } from "@juniper-lib/audio/dist/AudioManager";
import { DeviceManager } from "@juniper-lib/audio/dist/DeviceManager";
import { LocalUserMicrophone } from "@juniper-lib/audio/dist/LocalUserMicrophone";
import { arrayClear } from "@juniper-lib/collections/dist/arrays";
import { Controls, Download, Href, Max, Min, ReadOnly, Selected, Src, Value } from "@juniper-lib/dom/dist/attrs";
import { perc, width } from "@juniper-lib/dom/dist/css";
import { onClick, onInput } from "@juniper-lib/dom/dist/evts";
import { A, Audio, ButtonPrimary, Div, HtmlRender, InputNumber, Meter, Option, Pre, Select, elementSetText } from "@juniper-lib/dom/dist/tags";
import * as allAudioTypes from "@juniper-lib/mediatypes/dist/audio";
import { blobToObjectURL } from "@juniper-lib/tslib/dist/blobToObjectURL";
import { stringRandom } from "@juniper-lib/tslib/dist/strings/stringRandom";
import { PropertyList } from "@juniper-lib/widgets/dist/PropertyList";
import { createFetcher } from "../../createFetcher";
import { tilReady } from "../../createTestEnvironment";

const ACTIVITY_SENSITIVITY = 0.5;
const RECORDING_DELAY = .25;

const fetcher = createFetcher();
const audio = new AudioManager(fetcher, "localuser");
const microphones = new LocalUserMicrophone(audio.context);
const devices = new DeviceManager(microphones);

tilReady("main", audio).then(async () => {
    await devices.init();

    microphones.enabled = true;

    const mics = new Map<string, MediaDeviceInfo>(
        (await devices.getDevices(true))
            .filter(d => d.kind === "audioinput")
            .map(d => [d.deviceId, d])
    );

    let listening = false;
    const enableForm = (enable = true) => {
        const disable = listening || !enable;
        mediaTypeSelector.disabled = supportedTypes.length < 2 || disable;
        micSelector.disabled = mics.size < 2 || disable;
    };

    const curMic = microphones.device;
    const micSelector = Select(...Array.from(mics.values())
        .map(d => Option(
            Value(d.deviceId),
            Selected(curMic && d.deviceId === curMic.deviceId),
            d.label || d.groupId
        )),
    onInput(async () => {
        const mic = mics.get(micSelector.value);
        status(`Starting microphone "${mic.label}"."`);
        enableForm(false);
        await microphones.setDevice(mic);
        enableForm(true);
        status(`Microphone "${mic.label}"" started.`);
    }));

    const supportedTypes = Object
        .values(allAudioTypes)
        .filter(v => MediaRecorder.isTypeSupported(v.value));
    const mediaTypeSelector = Select(
        ...supportedTypes
            .map((v, i) =>
                Option(
                    Value(v.value),
                    Selected(i === 0),
                    v.extensions.length === 0
                        ? v.value
                        : `${v.value} (${v.extensions
                            .map(e => "." + e)
                            .join(", ")
                        })`
                )
            ),
        onInput(() => createRecorder())
    );

    const status = (status: string) =>
        elementSetText(recordingStatus, status);

    const startRecording = () => {
        status("Recording");
        recorder.start();
    };

    const stopRecording = () => {
        status("Recording complete");
        recorder.stop();
    };

    const startStopButton = ButtonPrimary(
        onClick(() => {
            listening = !listening;
            elementSetText(startStopButton, listening ? "Stop listening" : "Start listening");
            status(listening ? "Listening..." : "Not listening, click 'Start listening' button");
            enableForm();
        }),
        "Start listening"
    );

    const recordingStatus = Pre("Not listening, click 'Start listening'");

    const activityMeter = Meter(
        Min(0),
        Max(1),
        width(perc(100))
    );

    const activityNumber = InputNumber(
        Min(0),
        Max(1),
        ReadOnly(true)
    );

    const props = PropertyList.create(
        ["Microphone", micSelector],
        ["File type (optional)", mediaTypeSelector],
        ["Audio detection", activityMeter],
        ["Status", Div(startStopButton, recordingStatus)]
    );

    HtmlRender("main", props);

    const chunks = new Array<Blob>();
    const onStartRecording = () => {
        arrayClear(chunks);
    };

    const onRecordingDataAvailable = (evt: BlobEvent) => {
        chunks.push(evt.data);
    };

    const onStopRecording = () => {
        status("Recording complete");
        sendAudio(new Blob(chunks, {
            type: recorder.mimeType
        }));
    };

    let stopRecordingTimer: number = null;
    const checkActivity = () => {
        const level = activityNumber.valueAsNumber
            = activityMeter.value
            = micActivity.level;

        if (listening && level > ACTIVITY_SENSITIVITY) {
            if (recorder.state !== "recording") {
                startRecording();
            }
            else {
                if (stopRecordingTimer) {
                    clearTimeout(stopRecordingTimer);
                    stopRecordingTimer = null;
                }

                stopRecordingTimer = setTimeout(() => {
                    stopRecordingTimer = null;
                    stopRecording();
                }, RECORDING_DELAY * 2000) as any;
            }
        }
    };

    setInterval(checkActivity, 10);

    const sendAudio = async (blob: Blob) => {
        const url = blobToObjectURL(blob);
        const aud = Audio(Src(url), Controls(true));
        const output = Pre();
        const link = A(
            Href(url),
            Download(`audio${stringRandom(5)}`),
            "download"
        );
        const container = Div(aud, link, output);
        HtmlRender(document.body, container);
        status("Complete");
    };

    const micActivity = new ActivityDetector(audio.context);
    const micStreamDelay = audio.context.createDelay(1);
    const micStreamOut = audio.context.createMediaStreamDestination();

    let recorder: MediaRecorder = null;

    micStreamDelay.delayTime.value = RECORDING_DELAY;
    micStreamDelay.connect(micStreamOut);
    microphones.connect(micActivity);
    microphones.connect(micStreamDelay);

    const createRecorder = () => {
        if (recorder) {
            recorder.removeEventListener("start", onStartRecording);
            recorder.removeEventListener("dataavailable", onRecordingDataAvailable);
            recorder.removeEventListener("stop", onStopRecording);
            recorder = null;
        }

        recorder = new MediaRecorder(micStreamOut.stream, {
            mimeType: mediaTypeSelector.value
        });

        recorder.addEventListener("start", onStartRecording);
        recorder.addEventListener("dataavailable", onRecordingDataAvailable);
        recorder.addEventListener("stop", onStopRecording);
        enableForm(true);
    };

    createRecorder();
});