import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { WebAudioDestination } from "@juniper-lib/audio/destinations/WebAudioDestination";
import { WebAudioListenerNew } from "@juniper-lib/audio/listeners/WebAudioListenerNew";
import { AudioElementSource } from "@juniper-lib/audio/sources/AudioElementSource";
import { WebAudioPannerNew } from "@juniper-lib/audio/spatializers/WebAudioPannerNew";
import { max, min, srcObject, step, value } from "@juniper-lib/dom/attrs";
import { em, width } from "@juniper-lib/dom/css";
import { isModifierless, onClick, onInput } from "@juniper-lib/dom/evts";
import { BackgroundAudio, ButtonPrimary, elementApply, InputRange } from "@juniper-lib/dom/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";
import { Audio_Mpeg } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";


(async function () {

    const fetcher = await createFetcher();

    const context = new JuniperAudioContext({
        latencyHint: "interactive"
    });

    const listener = new WebAudioListenerNew(context);
    const dest = new WebAudioDestination(context, listener);
    BackgroundAudio(
        true,
        false,
        false,
        srcObject(dest.stream)
    );

    const diag = new AudioGraphDialog(context);

    const audio = await fetcher
        .get("/audio/forest.mp3")
        .audio(true, false, Audio_Mpeg)
        .then(unwrapResponse);

    const source = context.createMediaElementSource(audio);
    const spatializer = new WebAudioPannerNew(context);
    const node = new AudioElementSource(context, source, false, spatializer);
    node.connect(dest.spatializedInput);

    const slider = InputRange(
        min(-10),
        max(10),
        step(0.01),
        value(0),
        width(em(20)),
        onInput(() => {
            spatializer.setPosition(slider.valueAsNumber, 0, -2);
        })
    );

    document.body.appendChild(slider);


    spatializer.setPosition(0, 0, -2);

    Object.assign(window, {
        context,
        listener,
        dest,
        spatializer
    });

    if (!context.isReady) {
        const startButton = ButtonPrimary(
            "Start",
            onClick(() => context.resume())
        );

        elementApply(document.body,
            startButton);

        await context.ready;
        startButton.remove();
    }

    window.addEventListener("keypress", evt => {
        if (isModifierless(evt)) {
            if (evt.key === "`") {
                diag.toggle();
            }
            else if (evt.key === " ") {
                node.tog();
                if (diag.isOpen) {
                    diag.refreshData();
                }
            }
        }
    });
})();