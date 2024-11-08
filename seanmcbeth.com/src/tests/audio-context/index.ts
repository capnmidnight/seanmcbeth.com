import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { JuniperOscillatorNode } from "@juniper-lib/audio/dist/context/JuniperOscillatorNode";
import { isModifierless } from "@juniper-lib/dom/dist/evts";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/dist/AudioGraphDialog";
import { tilReady } from "../../createTestEnvironment";

(async function () {
    const context = new JuniperAudioContext({ latencyHint: "interactive" });
    const source = new JuniperOscillatorNode(context, {
        frequency: 440,
        type: "sine"
    });
    const diag = new AudioGraphDialog(context);

    source.connect(context.destination);
    source.start();

    await tilReady("main", context);

    window.addEventListener("keypress", evt => {
        if (isModifierless(evt)) {
            if (evt.key === "`") {
                diag.toggle();
            }
        }
    });

    Object.assign(window, {
        context,
        source
    });
})();