import { autoPlay, controls, muted } from "@juniper-lib/dom/attrs";
import { left, maxHeight, position, top, transform, width } from "@juniper-lib/dom/css";
import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, elementSetDisplay, Video } from "@juniper-lib/dom/tags";

const camvid = Video(
    position("absolute"),
    controls(false),
    muted(true),
    autoPlay(true),
    maxHeight("100%"),
    width("100%"),
    transform("scaleX(-1)")
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
)

document.body.append(
    camvid,
    button
);