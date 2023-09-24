import { AudioManager } from "@juniper-lib/audio/dist/AudioManager";
import { DeviceManager } from "@juniper-lib/audio/dist/DeviceManager";
import { LocalUserMicrophone } from "@juniper-lib/audio/dist/LocalUserMicrophone";
import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimary, HtmlRender } from "@juniper-lib/dom/dist/tags";
import { tilReady } from "@juniper-lib/dom/dist/tilReady";
import { DeviceDialog } from "@juniper-lib/threejs/dist/environment/DeviceDialog";
import { LocalUserWebcam } from "@juniper-lib/video/dist/LocalUserWebcam";
import { createFetcher } from "../../createFetcher";
import { isDebug } from "../../isDebug";

const fetcher = createFetcher(true);
const audio = new AudioManager(fetcher, "none");
const mics = new LocalUserMicrophone(audio.context);
const cams = new LocalUserWebcam();
const devices = new DeviceManager(mics, cams);
const dialog = new DeviceDialog(fetcher, devices, audio, mics, cams, isDebug);
dialog.showMicrophones
    = mics.enabled
    = dialog.showWebcams
    = cams.enabled
    = true;

tilReady("main", audio)
    .then(async () => {
        HtmlRender("main", ButtonPrimary("Show dialog", onClick(() => dialog.showDialog())));
    });