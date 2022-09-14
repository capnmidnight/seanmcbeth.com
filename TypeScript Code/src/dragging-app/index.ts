import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, elementApply, elementSetText } from "@juniper-lib/dom/tags";
import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { Cube } from "@juniper-lib/threejs/Cube";
import { lit } from "@juniper-lib/threejs/materials";
import { objGraph } from "@juniper-lib/threejs/objects";
import { TransformEditor, TransformMode } from "@juniper-lib/threejs/TransformEditor";
import { deg2rad } from "@juniper-lib/tslib/math";
import { createTestEnvironment } from "../createTestEnvironment";
import { isDebug } from "../isDebug";

(async function () {
    const env = await createTestEnvironment();
    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    await env.fadeOut();
    await env.load(skybox);

    env.skybox.setImage(skybox.path, skybox.result);
    env.skybox.rotation = deg2rad(176);

    const obj = new Cube(0.25, 0.25, 0.25, lit({
        color: "yellow"
    }));

    const transformer = new TransformEditor(env);

    obj.position.set(0, 1.75, -2);

    objGraph(env.foreground,
        obj,
        transformer
    );

    transformer.addEventListener("freeze", () => env.avatar.lockMovement = true);
    transformer.addEventListener("unfreeze", () => env.avatar.lockMovement = false);
    transformer.setTarget(obj);
    transformer.mode = TransformMode.Orbit;

    const modes = Object.values(TransformMode);
    const switchModeButton = ButtonPrimary(
        transformer.mode,
        onClick(() => {
            const modeIdx = modes.indexOf(transformer.mode);
            const nextMode = modes[(modeIdx + 1) % modes.length];
            transformer.mode = nextMode;
            elementSetText(switchModeButton, transformer.mode);
        })
    );

    elementApply(env.screenUISpace.bottomRowLeft, switchModeButton)

    await env.fadeIn();
})();