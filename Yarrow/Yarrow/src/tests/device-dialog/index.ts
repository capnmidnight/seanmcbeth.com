import { AudioManager } from "@juniper-lib/audio/AudioManager";
import { DeviceManager } from "@juniper-lib/audio/DeviceManager";
import { LocalUserMicrophone } from "@juniper-lib/audio/LocalUserMicrophone";
import { onClick } from "@juniper-lib/dom/evts";
import { ButtonPrimary, elementApply } from "@juniper-lib/dom/tags";
import { tilReady } from "@juniper-lib/dom/tilReady";
import { DeviceDialog } from "@juniper-lib/threejs/environment/DeviceDialog";
import { LocalUserWebcam } from "@juniper-lib/video/LocalUserWebcam";
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
        elementApply("main", ButtonPrimary("Show dialog", onClick(() => dialog.showDialog())));
    });