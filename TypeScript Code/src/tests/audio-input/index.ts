import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { Disabled, Max, Min, Step, Title_attr, Value } from "@juniper-lib/dom/attrs";
import { isModifierless, onClick, onInput } from "@juniper-lib/dom/evts";
import { ButtonPrimary, InputRange } from "@juniper-lib/dom/tags";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";

(async function () {
    const context = new JuniperAudioContext({ latencyHint: "interactive" });
    const volume = context.createGain();
    const diag = new AudioGraphDialog(context);
    const slider = InputRange(
        Min(0),
        Max(10),
        Step(0.1),
        Value(1),
        Title_attr("volume"),
        Disabled(true),
        onInput(() => volume.gain.value = slider.valueAsNumber)
    );

    volume.connect(context.destination);


    document.body.append(
        ButtonPrimary(
            "Start",
            onClick(async function (this: HTMLButtonElement) {
                this.disabled = true;
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                const streamNode = context.createMediaStreamSource(stream);
                streamNode.connect(volume);
                slider.disabled = false;
                this.remove();
            })
        ),
        slider
    );

    window.addEventListener("keypress", evt => {
        if (isModifierless(evt)) {
            if (evt.key === "`") {
                diag.toggle();
            }
        }
    });

    Object.assign(window, {
        context
    });
})();