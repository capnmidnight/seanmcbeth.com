import { AudioManager } from "@juniper-lib/audio/AudioManager";
import { max, min, step, value } from "@juniper-lib/dom/attrs";
import { em, width } from "@juniper-lib/dom/css";
import { isModifierless, onClick, onInput } from "@juniper-lib/dom/evts";
import { ButtonPrimary, InputRange } from "@juniper-lib/dom/tags";
import { AssetFile } from "@juniper-lib/fetcher/Asset";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";
import { Audio_Mpeg } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";
import { isDebug } from "../isDebug";


(async function () {
    const fetcher = createFetcher();
    const audio = new AudioManager(fetcher, "local");

    Object.assign(window, {
        audio
    });

    if (!audio.isReady) {
        const button = ButtonPrimary(
            "Start",
            onClick(() => button.disabled = true, true));
        document.body.append(button);
        await audio.ready;
        button.remove();
    }

    const diag = new AudioGraphDialog(audio.context);

    const clip1Asset = new AssetFile("/audio/forest.mp3", Audio_Mpeg, !isDebug);
    const clip2Asset = new AssetFile("/audio/test-clip.mp3", Audio_Mpeg, !isDebug);

    await fetcher.assets(clip1Asset, clip2Asset);

    const clip1 = await audio.createClip("forest", clip1Asset, true, true, false, 0.25, []);
    const clip2 = await audio.createBasicClip("test-clip", clip2Asset, 1);

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