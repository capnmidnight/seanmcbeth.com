import { AudioGraphDialog } from "@juniper-lib/graphics2d/AudioGraphDialog";
import { TextImageOptions } from "@juniper-lib/graphics2d/TextImage";
import { objGraph } from "@juniper-lib/threejs/objects";
import { TextMeshButton } from "@juniper-lib/threejs/widgets/TextMeshButton";
import { withTestEnvironment } from "../../createTestEnvironment";

const buttonStyle: Partial<TextImageOptions> = {
    bgFillColor: "#1e4388",
    scale: 500,
    padding: 0.05,
    maxHeight: 0.25,
    minHeight: 0.25,
    bgStrokeColor: "white"
};

withTestEnvironment(async (env) => {
    const diag = new AudioGraphDialog(env.audio.context);

    await env.load();

    const button1 = new TextMeshButton(env, "Button1", "Click Me?", buttonStyle);
    button1.enabled = false;
    button1.addEventListener("click", () => {
        env.audio.playClip("footsteps");
        diag.showDialog();
    });
    button1.object.position.set(-0.5, 1.75, -3);

    const button2 = new TextMeshButton(env, "Button2", "Click Me.", buttonStyle);
    button2.addEventListener("click", () => button1.enabled = !button1.enabled);
    button2.object.position.set(0.5, 1.75, -3);

    objGraph(env.foreground,
        button1,
        button2);
});