import { objGraph } from "@juniper-lib/threejs/objects";
import { PlaybackButton } from "@juniper-lib/threejs/widgets/PlaybackButton";
import { withTestEnvironment } from "../../createTestEnvironment";

withTestEnvironment(async env => {
    await env.load();
    const pb = new PlaybackButton(env, env.uiButtons, "/video/st-tng-data.mp4", "st-tng", "st-tng", 1, env.videoPlayer);
    const showHideVideo = (v: boolean) => () => {
        env.videoPlayer.object.visible = v;
        if (v) {
            objGraph(pb, env.videoPlayer);
            env.videoPlayer.object.position.set(0, 0.5, 0);
            env.videoPlayer.object.quaternion.identity();
            env.videoPlayer.setStereoParameters("N/A", "mono");
        }
    };
    pb.addEventListener("play", showHideVideo(true));
    pb.addEventListener("stop", showHideVideo(false));
    pb.object.position.set(0, 1.25, -2);
    objGraph(env.foreground, pb);
});