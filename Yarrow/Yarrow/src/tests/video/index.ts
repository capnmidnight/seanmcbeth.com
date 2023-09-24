import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { NoSpatializer } from "@juniper-lib/audio/dist/spatializers/NoSpatializer";
import { value } from "@juniper-lib/dom/dist/attrs";
import { onInput } from "@juniper-lib/dom/dist/evts";
import { BR, ButtonPrimary, HtmlRender, Option, Select } from "@juniper-lib/dom/dist/tags";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { FullVideoRecord } from "@juniper-lib/video/dist/data";
import { VideoPlayer } from "@juniper-lib/video/dist/VideoPlayer";
import { YouTubeProxy } from "@juniper-lib/video/dist/YouTubeProxy";
import { createFetcher } from "../../createFetcher";
import { makeProxyURL } from "../../vr-apps/yarrow/proxy";

(async function () {
    const urls = [
        "https://www.youtube.com/watch?v=sPyAQQklc1s",
        "https://www.youtube.com/watch?v=MgJITGvVfR0",
        "https://www.youtube.com/watch?v=UUzQcPuK8uk",
        "https://www.youtube.com/watch?v=K6uGXtPCjEw",
        "https://www.youtube.com/watch?v=7NGExT9cPKA",
        "https://www.youtube.com/watch?v=mlbWpufL_5s",
        "https://www.youtube.com/watch?v=PqpVB72lZa8",
        "https://www.youtube.com/watch?v=uC7ELzPyrcE"
    ];

    const context = new JuniperAudioContext();
    const player = new VideoPlayer(context, new NoSpatializer(context.destination));
    const fetcher = createFetcher();
    const proxy = new YouTubeProxy(fetcher, makeProxyURL);
    const videosSelect = Select(
        onInput(async () => {
            try {
                videosSelect.disabled = true;
                const video = videos.get(videosSelect.value);
                if (isDefined(video)) {
                    await player.load(video);
                }
                else {
                    player.clear();
                }
            }
            finally {
                videosSelect.disabled = false;
            }
        }),
        Option("NONE")
    );


    if (context.state !== "running") {
        const btn = ButtonPrimary("Load");
        HtmlRender("main", btn);
        await context.ready;
        btn.remove();
    }

    HtmlRender("main",
        videosSelect,
        BR(),
        player);

    videosSelect.disabled = true;

    const videos = new Map(await Promise.all(
        urls.map<Promise<[string, FullVideoRecord]>>(async (url) => {
            const data = await proxy.loadData(makeProxyURL(url).href);
            return [data.title, data];
        }))
    );

    HtmlRender(videosSelect, ...Array.from(videos.keys()).map(title =>
        Option(
            title,
            value(title)
        )
    ));

    videosSelect.disabled = false;
})();
