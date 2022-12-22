import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { JuniperOscillatorNode } from "@juniper-lib/audio/context/JuniperOscillatorNode";
import { isModifierless, onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary } from "@juniper-lib/dom/tags";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";

(async function () {
    const context = new JuniperAudioContext({ latencyHint: "interactive" });
    const source = new JuniperOscillatorNode(context, {
        frequency: 440,
        type: "sine"
    });
    const diag = new AudioGraphDialog(context);

    source.connect(context.destination);
    source.start();

    if (!context.isReady) {
        const button = ButtonPrimary(
            "Start",
            onClick(() => button.disabled = true, true));
        document.body.append(button);
        await context.ready;
        button.remove();
    }

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