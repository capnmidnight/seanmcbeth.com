import { Controls, Disabled, Muted, Src, SrcObject } from "@juniper-lib/dom/dist/attrs";
import { onClick } from "@juniper-lib/dom/dist/evts";
import { onUserGesture } from "@juniper-lib/dom/dist/onUserGesture";
import { Audio, ButtonPrimary, Div, HtmlRender } from "@juniper-lib/dom/dist/tags";
import { once } from "@juniper-lib/events/dist/once";

(async function () {
    const context = new AudioContext();
    const streamNode = context.createMediaStreamDestination();
    const elem1 = Audio(
        Controls(false),
        Muted(true),
        SrcObject(streamNode.stream));

    const startButton = ButtonPrimary(
        "Start",
        onClick(() => startButton.disabled = true, true));
    const playButton1 = ButtonPrimary(
        "Play 1",
        Disabled(true),
        onClick(() => play1 = true));
    const playButton2 = ButtonPrimary(
        "Play 2",
        Disabled(true),
        onClick(() => play2 = true));
    const playButton3 = ButtonPrimary(
        "Play 3",
        Disabled(true),
        onClick(() => play3 = true));

    let play1 = false;
    let play2 = false;
    let play3 = false;

    HtmlRender("main",
        startButton,
        Div(playButton1),
        Div(playButton2),
        Div(playButton3)
    );

    const elem1ready = once(elem1, "play", "error");
    onUserGesture(() => elem1.play());

    await elem1ready;
    elem1.pause();
    elem1.autoplay = false;
    elem1.muted = false;
    elem1.srcObject = null;
    elem1.src = "/audio/door_open.mp3";
    startButton.remove();
    playButton1.disabled = false;
    playButton2.disabled = false;

    const elem2 = Audio(
        Controls(false),
        Muted(false),
        Src("/audio/door_close.mp3"));

    let elem3: HTMLAudioElement;
    let firstTime = true;

    setInterval(() => {
        if (play1) {
            play1 = false;
            elem1.play();
        }
        if (play2) {
            play2 = false;
            elem2.play();

            if (firstTime) {
                firstTime = false;
                elem3 = Audio(
                    Controls(false),
                    Muted(false),
                    Src("/audio/basic_error.mp3"));
                playButton3.disabled = false;
            }
        }

        if (play3) {
            play3 = false;
            elem3.play();
        }
    }, 10);

    let counter = -1;

    setInterval(() => {
        counter = (counter + 1) % 3;
        switch (counter) {
            case 0: play1 = true; break;
            case 1: play2 = true; break;
            case 2: play3 = true; break;
        }
    }, 1000);
})();