import { FontDescription, loadFont } from "@juniper-lib/dom/fonts";
import { PriorityList } from "@juniper-lib/collections/PriorityList";
import { PriorityMap } from "@juniper-lib/collections/PriorityMap";
import { stringRandom } from "@juniper-lib/tslib/strings/stringRandom";
import { version as pkgVersion } from "../package.json";

export const version = DEBUG
    ? stringRandom(10)
    : pkgVersion;

/**
 * When running on systems that do not understand the relationship between the camera and 
 * the ground (marker-tracking AR, 3DOF VR), this is the height that is used for the camera 
 * off of the ground. 1.75 meters is about 5 feet 9 inches.
 **/
export const defaultAvatarHeight = 1.75;

export const enableFullResolution = false;

export const defaultFont: FontDescription = {
    fontFamily: "Segoe UI",
    fontSize: 20
};

export const emojiFont: FontDescription = {
    fontFamily: "Segoe UI Emoji",
    fontSize: 20
};

export async function loadFonts() {
    await Promise.all([
        loadFont(defaultFont),
        loadFont(emojiFont)
    ]);
}

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
        ["ui", "install"],
        ["ui", "quit"],
        ["ui", "lobby"],
        ["zoom", "zoom-in"],
        ["zoom", "zoom-out"],
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
                `/img/ui/${iconName}.png`);
        }
    }

    return uiImagePaths;
}