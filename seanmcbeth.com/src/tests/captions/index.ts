import { Controls, Default, Kind, Label_attr, Preload, Src, SrcLang } from "@juniper-lib/dom/dist/attrs";
import { HtmlRender, Track, Video } from "@juniper-lib/dom/dist/tags";

const vid = Video(
    Src("/video/sintel-short.mp4"),
    Controls(true),
    Preload("metadata"),
    Track(
        Label_attr("English"),
        Kind("subtitles"),
        SrcLang("en"),
        Src("/video/sintel-en.vtt"),
        Default(true)
    )
);

for (const track of Array.from(vid.textTracks)) {
    track.addEventListener("cuechange", () => {
        for (const cue of Array.from(track.activeCues)) {
            if (cue instanceof VTTCue) {
                console.log(cue.text);
            }
        }
    });
}

HtmlRender("main", vid);