import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { getRayTarget, RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { Image2D } from "@juniper-lib/threejs/widgets/Image2D";
import { JavaScript, Primrose } from "primrose/src";
import { createTestEnvironment } from "../createTestEnvironment";
import { isDebug } from "../isDebug";
import { defaultAvatarHeight } from "../settings";

(async function () {

    const editor = new Primrose({
        width: 1024,
        height: 1024,
        language: JavaScript,
        lineNumbers: true,
        wordWrap: true,
        fontSize: 10,
        scaleFactor: 2
    });

    editor.value = createTestEnvironment.toString();

    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    const env = await createTestEnvironment();

    await env.fadeOut();

    env.skybox.setImage(skybox.path, skybox.result);

    const img = new Image2D(env, "Editor", "dynamic");
    img.setTextureMap(editor.canvas);
    img.position.set(0, defaultAvatarHeight, -2);

    const target = new RayTarget(img);
    target.addMesh(img.mesh);
    target.addEventListener("enter", () => editor.touch.readOverEventUV());
    target.addEventListener("exit", () => editor.touch.readOutEventUV());
    target.addEventListener("down", (evt) => editor.touch.readDownEventUV(evt.hit));
    target.addEventListener("up", (evt) => editor.touch.readUpEventUV(evt.hit));
    target.addEventListener("move", (evt) => editor.touch.readMoveEventUV(evt.hit));
    target.addEventListener("click", () => editor.focus());
    target.clickable = true;

    editor.addEventListener("update", () =>
        img.updateTexture());

    if (env.avatar.keyboardControlEnabled) {
        editor.addEventListener("focus", () => env.avatar.keyboardControlEnabled = false);
        editor.addEventListener("blur", () => env.avatar.keyboardControlEnabled = true);
    }

    env.eventSys.addEventListener("click", (evt) => {
        if (!evt.hit || getRayTarget(evt.hit.object) !== target) {
            editor.blur();
        }
    })

    env.foreground.add(img);

    await env.fadeIn();
})();