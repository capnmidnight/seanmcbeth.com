import { AssetImage } from "@juniper-lib/fetcher/Asset";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { getRayTarget, RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { Image2D } from "@juniper-lib/threejs/widgets/Image2D";
import { JavaScript, Primrose } from "primrose/src";
import { withTestEnvironment } from "../../createTestEnvironment";
import { isDebug } from "../../isDebug";
import { defaultAvatarHeight } from "../../settings";

const editor = new Primrose({
    width: 1024,
    height: 1024,
    language: JavaScript,
    lineNumbers: true,
    wordWrap: true,
    fontSize: 10,
    scaleFactor: 2
});

editor.value = `const gestures = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend"
];

function onUserGesture(callback, test) {
    const realTest = test || () => true;

    const check = async (evt) => {
        if (evt.isTrusted && await realTest()) {
            for (const gesture of gestures) {
                window.removeEventListener(gesture, check);
            }

            await callback();
        }
    };

    for (const gesture of gestures) {
        window.addEventListener(gesture, check);
    }
}`;

withTestEnvironment(async (env) => {
    const skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug);
    await env.load(skybox);

    env.skybox.setImage(skybox.path, skybox.result);

    const img = new Image2D(env, "Editor", "dynamic");
    img.setTextureMap(editor.canvas);
    img.position.set(0, defaultAvatarHeight, -2);

    const target = new RayTarget(img);
    target.addMesh(img.mesh);

    function chooseDevice() {
        if (env.eventSys.mouse.isActive) {
            return editor.mouse;
        }
        else {
            return editor.touch;
        }
    }

    target.addEventListener("enter", () => chooseDevice().readOverEventUV());
    target.addEventListener("exit", () => chooseDevice().readOutEventUV());
    target.addEventListener("down", (evt) => chooseDevice().readDownEventUV(evt.hit));
    target.addEventListener("up", (evt) => chooseDevice().readUpEventUV(evt.hit));
    target.addEventListener("move", (evt) => chooseDevice().readMoveEventUV(evt.hit));
    target.addEventListener("click", () => editor.focus());
    target.clickable = true;

    editor.addEventListener("update", () =>
        img.updateTexture());

    if (env.avatar.keyboardControlEnabled) {
        editor.addEventListener("focus", () => env.avatar.lockMovement = true);
        editor.addEventListener("blur", () => env.avatar.lockMovement = false);
    }

    env.eventSys.addEventListener("click", (evt) => {
        if (!evt.hit || getRayTarget(evt.hit.object) !== target) {
            editor.blur();
        }
    });

    env.foreground.add(img);
});