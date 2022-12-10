import { AudioManager } from "@juniper-lib/audio/AudioManager";
import { max, min, step, value } from "@juniper-lib/dom/attrs";
import { em, width } from "@juniper-lib/dom/css";
import { isModifierless, onClick, onInput } from "@juniper-lib/dom/evts";
import { ButtonPrimary, elementApply, InputRange } from "@juniper-lib/dom/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";
import { Audio_Mpeg } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";


(async function () {

    const fetcher = await createFetcher();
    const audio = new AudioManager("local");

    const diag = new AudioGraphDialog(audio.context);

    const forest = await fetcher
        .get("/audio/forest.mp3")
        .audio(true, false, Audio_Mpeg)
        .then(unwrapResponse);

    const clip1 = audio.createClip("forest", forest, true, true, false, 1, []);
    clip1.volume = 0.25;

    const clip2 = await audio.loadBasicClip("test-clip", "/audio/test-clip.mp3", 1);

    const slider = InputRange(
        min(-10),
        max(10),
        step(0.01),
        value(0),
        width(em(20)),
        onInput(() => {
            audio.setClipPosition("forest", slider.valueAsNumber, 0, -2);
        })
    );

    document.body.appendChild(slider);


    audio.setUserPosition("local", 0, 0, -2);

    Object.assign(window, {
        audio
    });

    if (!audio.context.isReady) {
        const startButton = ButtonPrimary(
            "Start",
            onClick(() => audio.context.resume())
        );

        elementApply(document.body,
            startButton);

        await audio.context.ready;
        startButton.remove();
    }

    window.addEventListener("keypress", evt => {
        if (isModifierless(evt)) {
            if (evt.key === "`") {
                diag.toggle();
            }
            else if (evt.key === "a") {
                clip1.tog();
                if (diag.isOpen) {
                    diag.refreshData();
                }
            }
            else if (evt.key === "b") {
                clip2.play();
                if (diag.isOpen) {
                    diag.refreshData();
                }
            }
        }
    });
})();