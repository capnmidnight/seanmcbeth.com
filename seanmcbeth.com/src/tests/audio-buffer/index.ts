import { JuniperAudioBufferSourceNode } from "@juniper-lib/audio/dist/context/JuniperAudioBufferSourceNode";
import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { Value } from "@juniper-lib/dom/dist/attrs";
import { isModifierless } from "@juniper-lib/dom/dist/evts";
import { Progress } from "@juniper-lib/dom/dist/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { AudioGraphDialog } from "@juniper-lib/graphics2d/dist/AudioGraphDialog";
import { Audio_Mpeg } from "@juniper-lib/mediatypes";
import { progressHTML } from "@juniper-lib/widgets/dist/progressHTML";
import { createFetcher } from "../../createFetcher";
import { tilReady } from "../../createTestEnvironment";

(async function () {
    const progress = Progress(Value(0));
    document.body.append(progress);
    const context = new JuniperAudioContext({ latencyHint: "interactive" });
    const fetcher = createFetcher();
    const buffer = await fetcher
        .get("/audio/forest.mp3")
        .progress(progressHTML(progress))
        .audioBuffer(context, Audio_Mpeg)
        .then(unwrapResponse);
    progress.remove();
    const source = new JuniperAudioBufferSourceNode(context, { buffer });
    const diag = new AudioGraphDialog(context);

    source.connect(context.destination);
    source.loop = true;
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
        buffer,
        source
    });
})();