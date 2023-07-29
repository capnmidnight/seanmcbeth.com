import { AudioManager } from "@juniper-lib/audio/AudioManager";
import { Max, Min, Step, Value } from "@juniper-lib/dom/attrs";
import { em, width } from "@juniper-lib/dom/css";
import { isModifierless, onClick, onInput } from "@juniper-lib/dom/evts";
import { ButtonPrimary, Div, InputRange, Progress, HtmlRender } from "@juniper-lib/dom/tags";
import { all } from "@juniper-lib/events/all";
import { AssetFile } from "@juniper-lib/fetcher/Asset";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";
import { Audio_Mpeg } from "@juniper-lib/mediatypes";
import { progressHTML } from "@juniper-lib/widgets/progressHTML";
import { createFetcher } from "../../createFetcher";
import { tilReady } from "../../createTestEnvironment";
import { isDebug } from "../../isDebug";


(async function () {
    const prog = Progress(Value(0));
    HtmlRender("main", prog);

    const fetcher = createFetcher();
    const audio = new AudioManager(fetcher, "local");
    const clip1Asset = new AssetFile("/audio/forest.mp3", Audio_Mpeg, !isDebug);
    const clip2Asset = new AssetFile("/audio/test-clip.mp3", Audio_Mpeg, !isDebug);

    await all(
        fetcher.assets(progressHTML(prog), clip1Asset, clip2Asset),
        tilReady("main", audio)
    );

    prog.remove();

    const clip1 = await audio.createClip("forest", clip1Asset, true, true, true, false, 0.25, []);
    const clip2 = await audio.createBasicClip("test-clip", clip2Asset, 1);
    const diag = new AudioGraphDialog(audio.context);
    const slider = InputRange(
        Min(-10),
        Max(10),
        Step(0.01),
        Value(0),
        width(em(20)),
        onInput(() => {
            audio.setClipPosition("forest", slider.valueAsNumber, 0, -2);
        })
    );

    HtmlRender("main",
        Div(ButtonPrimary("A", onClick(() => clip1.tog()))),
        Div(ButtonPrimary("B", onClick(() => clip2.play()))),
        Div(ButtonPrimary("Graph", onClick(() => diag.toggle()))),
        slider);

    clip1.play();

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

    Object.assign(window, {
        audio,
        clip1Asset,
        clip2Asset,
        clip1,
        clip2
    });
})();
