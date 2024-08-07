import { AutoPlay, Controls, Muted } from "@juniper-lib/dom/dist/attrs";
import { left, maxHeight, position, top, transform, width } from "@juniper-lib/dom/dist/css";
import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimary, HtmlRender, Video, elementSetDisplay } from "@juniper-lib/dom/dist/tags";

const camvid = Video(
    position("absolute"),
    Controls(false),
    Muted(true),
    AutoPlay(true),
    maxHeight("100%"),
    width("100%"),
    left("50%"),
    top("50%"),
    transform("translate(-50%, -50%)", "scaleX(-1)")
);

const button = ButtonPrimary(
    "Start",
    position("absolute"),
    left("50%"),
    top("50%"),
    transform("translate(-50%, -50%)"),
    onClick(async () => {
        elementSetDisplay(button, false);
        camvid.srcObject = await navigator.mediaDevices.getUserMedia({
            video: true
        });
    })
);

HtmlRender("main", camvid, button);