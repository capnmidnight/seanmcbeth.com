import { controls, htmlDefault, kind, label, preload, src, srcLang } from "@juniper-lib/dom/attrs";
import { elementApply, Track, Video } from "@juniper-lib/dom/tags";

const vid = Video(
    src("/videos/sintel-short.mp4"),
    controls(true),
    preload("metadata"),
    Track(
        label("English"),
        kind("subtitles"),
        srcLang("en"),
        src("/videos/sintel-en.vtt"),
        htmlDefault(true)));

for (const track of Array.from(vid.textTracks)) {
    track.addEventListener("cuechange", () => {
        for (const cue of Array.from(track.activeCues)) {
            if (cue instanceof VTTCue) {
                console.log(cue.text);
            }
        }
    });
}

elementApply("main", vid);