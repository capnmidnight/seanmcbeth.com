import { withTestEnvironment } from "../createTestEnvironment";
import { PlaybackButton } from "@juniper-lib/threejs/widgets/PlaybackButton";
import { objGraph } from "@juniper-lib/threejs/objects";

withTestEnvironment(async env => {
    await env.load();
    const pb = new PlaybackButton(env, env.uiButtons, "/audio/forest.mp3", "forest", "forest", 1, env.audioPlayer);
    pb.object.position.set(0, 1.75, -2);
    objGraph(env.foreground, pb);
});