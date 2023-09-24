import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimary, HtmlRender, elementSetText } from "@juniper-lib/dom/dist/tags";
import { AssetImage } from "@juniper-lib/fetcher/dist/Asset";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { cube } from "@juniper-lib/threejs/dist/Cube";
import { TransformEditor, TransformMode } from "@juniper-lib/threejs/dist/TransformEditor";
import { lit } from "@juniper-lib/threejs/dist/materials";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { deg2rad } from "@juniper-lib/tslib/dist/math";
import { withTestEnvironment } from "../../createTestEnvironment";
import { isDebug } from "../../isDebug";

withTestEnvironment(async (env) => {
    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    await env.load(skybox);

    env.skybox.setImage(skybox.path, skybox.result);
    env.skybox.rotation = deg2rad(176);

    const obj = cube("TestObj", 0.25, 0.25, 0.25, lit({
        color: "yellow"
    }));

    const transformer = new TransformEditor(env);

    obj.position.set(0, 1.75, -2);

    objGraph(env.foreground,
        obj,
        transformer
    );

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

    HtmlRender(env.screenUISpace.bottomLeft, switchModeButton);
});