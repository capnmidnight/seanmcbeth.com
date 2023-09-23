import { disableAdvancedSettings } from "@juniper-lib/dom/canvas";
import { rgb } from "@juniper-lib/dom/css";
import { FontDescription, loadFont } from "@juniper-lib/dom/fonts";
import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import type { TextImageOptions } from "@juniper-lib/graphics2d/TextImage";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes";
import { MenuDescription } from "@juniper-lib/threejs/menu/Menu";
import { PriorityList } from "@juniper-lib/collections/PriorityList";
import { PriorityMap } from "@juniper-lib/collections/PriorityMap";
import { all } from "@juniper-lib/events/all";
import { IDataLogger } from "@juniper-lib/tslib/IDataLogger";
import { stringRandom } from "@juniper-lib/tslib/strings/stringRandom";
import { version as pkgVersion } from "../package.json";
import { DataLogger } from "./DataLogger";
import { isDebug } from "./isDebug";

export const version = /*@__PURE__*/ isDebug
    ? stringRandom(10)
    : pkgVersion;
/**
 * When running on systems that do not understand the relationship between the camera and 
 * the ground (marker-tracking AR, 3DOF VR), this is the height that is used for the camera 
 * off of the ground. 1.75 meters is about 5 feet 9 inches.
 **/
export const defaultAvatarHeight = /*@__PURE__*/ 1.75;

export const enableFullResolution = /*@__PURE__*/ false;

export const MULTIPLAYER_HUB_NAME = /*@__PURE__*/ "/Multiplayer";


export const DEMO_PPI = /*@__PURE__*/ 50;
export const DEMO_DIM = /*@__PURE__*/ 12;
export const DEMO_PX = /*@__PURE__*/ DEMO_PPI * DEMO_DIM;

export const useWorkers = /*@__PURE__*/ !(isDebug || disableAdvancedSettings);

export const menu: MenuDescription = {
    images: {
        backButton: "/images/back-button.jpg",
        defaultButton: "/images/back-button.jpg",
        title: "/images/menu-title.jpg",
        logo: {
            back: "/images/main-logo.png"
        }
    },
    font: {
        fontFamily: "Lato",
        fontSize: 20,
        fontWeight: "bold"
    }
};

export const defaultFont: FontDescription = {
    fontFamily: "Lato",
    fontSize: 20
};

export const emojiFont: FontDescription = {
    fontFamily: "Segoe UI Emoji",
    fontSize: 20
};

export async function loadFonts() {
    await all(
        loadFont(defaultFont),
        loadFont(emojiFont),
        loadFont(menu.font)
    );
}

export const DLSBlue = rgb(30, 67, 136);
export const BasicLabelColor = rgb(78, 77, 77);

const baseTextStyle: Partial<TextImageOptions> = {
    fontFamily: defaultFont.fontFamily,
    fontSize: defaultFont.fontSize,
    textFillColor: "white"
};

export const textButtonStyle: Partial<TextImageOptions> = Object.assign({}, baseTextStyle, {
    bgFillColor: rgb(0, 120, 215),
    bgStrokeColor: "black",
    bgStrokeSize: 0.02,
    padding: {
        top: 0.025,
        left: 0.05,
        bottom: 0.025,
        right: 0.05
    },
    minHeight: 0.20,
    maxHeight: 0.20,
    scale: 300
});

export const textLabelStyle: Partial<TextImageOptions> = Object.assign({}, baseTextStyle, {
    textStrokeColor: "black",
    textStrokeSize: 0.01,
    minHeight: 0.25,
    maxHeight: 0.25
});

export function getUIImagePaths() {
    const imageNames = new PriorityList([
        ["arrow", "arrow-up"],
        ["arrow", "arrow-down"],
        ["arrow", "arrow-left"],
        ["arrow", "arrow-right"],
        ["chat", "user"],
        ["chat", "chat"],
        ["ui", "menu"],
        ["ui", "settings"],
        ["ui", "quit"],
        ["ui", "lobby"],
        ["zoom", "zoom-in"],
        ["zoom", "zoom-out"],
        ["zoom", "zoom-info"],
        ["environment-audio", "environment-audio-mute"],
        ["environment-audio", "environment-audio-unmute"],
        ["headphones", "headphones-unmuted"],
        ["headphones", "headphones-muted"],
        ["microphone", "microphone-mute"],
        ["microphone", "microphone-unmute"],
        ["volume", "volume-muted"],
        ["volume", "volume-low"],
        ["volume", "volume-medium"],
        ["volume", "volume-high"],
        ["media", "media-pause"],
        ["media", "media-play"],
        ["media", "media-stop"],
        ["media", "media-replay"],
        ["ar", "ar-enter"],
        ["ar", "ar-exit"],
        ["vr", "vr-enter"],
        ["vr", "vr-exit"],
        ["fullscreen", "fullscreen-enter"],
        ["fullscreen", "fullscreen-exit"]
    ]);

    const uiImagePaths = new PriorityMap<string, string, string>();

    for (const [setName, iconNames] of imageNames.entries()) {
        for (const iconName of iconNames) {
            uiImagePaths.add(
                setName,
                iconName.replace(setName + "-", ""),
                `/images/ui/${iconName}.png`);
        }
    }

    return uiImagePaths;
}

const JS_EXT = isDebug ? ".js" : ".min.js";
const CSS_EXT = isDebug ? ".css" : ".min.css";

function getAppUrl(ext: string, name: string) {
    return `/js/${name}/index${ext}?v=${version}`
}

export function getScriptUrl(name: string) {
    return getAppUrl(JS_EXT, name);
}

export function getStyleUrl(name: string) {
    return getAppUrl(CSS_EXT, name);
}

export function getDOMScriptUrl(name: string) {
    return getScriptUrl("dom-apps/" + name);
}

export function getDOMStyleUrl(name: string) {
    return getStyleUrl("dom-apps/" + name);
}

export function getAppScriptUrl(name: string) {
    return getScriptUrl("vr-apps/" + name);
}

export function getAppStyleUrl(name: string) {
    return getStyleUrl("vr-apps/" + name);
}

export function getWorkerUrl(name: string) {
    return getScriptUrl("workers/" + name);
}

export function getLibScriptUrl(name: string) {
    return getScriptUrl("libs/" + name);
}

export function createDataLogger(fetcher: IFetcher): IDataLogger {
    let reportID: number = null;
    let lastTask: Promise<void> = Promise.resolve();
    const log = async (key: string, value?: object) => {
        reportID = await fetcher.post("/")
            .body({ reportID, key, value }, Application_JsonUTF8)
            .object<number>()
            .then(unwrapResponse);
    };

    return new DataLogger((key: string, value?: object) => {
        lastTask = lastTask.then(() => log(key, value));
    });
}