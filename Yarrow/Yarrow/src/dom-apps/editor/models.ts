import { cancelTag, framedPicture, globeShowingAmericas, joystick, megaphone, memo, scroll, speakerHighVolume, upArrow, videoCamera, wastebasket, worldMap } from "@juniper-lib/emoji/dist";
import { TypedEvent } from "@juniper-lib/events/dist/EventBase";
import { assertNever, isDefined, isNullOrUndefined, isString } from "@juniper-lib/tslib/dist/typeChecks";
import { Audio } from "../../vr-apps/yarrow/Audio";
import { StationConnectionData, Zone } from "../../vr-apps/yarrow/data";
import { Model } from "../../vr-apps/yarrow/Model";
import { Sign } from "../../vr-apps/yarrow/Sign";
import { Station } from "../../vr-apps/yarrow/Station";
import { Video } from "../../vr-apps/yarrow/Video";
import { Text } from "../../vr-apps/yarrow/Text";
import { EditableScenario } from "../editor/EditableScenario";

export type FileAssetKind =
    | "station"
    | "ambientAudio"
    | "audio"
    | "video"
    | "text"
    | "sign"
    | "model";

export type ResetableAssetKind =
    | FileAssetKind
    | "connection";

export type DeletableAssetKind =
    | ResetableAssetKind
    | "zone";

export type AssetKind =
    | DeletableAssetKind
    | "scenario";

export type FileAsset =
    | Station
    | Audio
    | Video
    | Text
    | Sign
    | Model;

export type ResetableAsset =
    | FileAsset
    | StationConnectionData;

export type DeletableAsset =
    | ResetableAsset
    | Zone;

export type Asset =
    | DeletableAsset
    | EditableScenario;

export function isModel(obj: Asset): obj is Model {
    return obj instanceof Model;
}

export function isSign(obj: Asset): obj is Sign {
    return obj instanceof Sign;
}

export function isVideo(obj: Asset): obj is Video {
    return obj instanceof Video;
}

export function isText(obj: Asset): obj is Text {
    return obj instanceof Text;
}

export function isAudio(obj: Asset): obj is Audio {
    return obj instanceof Audio;
}

export function isAmbientAudio(obj: Asset): obj is Audio {
    return isAudio(obj) && obj.spatialize;
}

export function isVoiceOver(obj: Asset): obj is Audio {
    return isAudio(obj) && !obj.spatialize;
}

export function isZone(obj: Asset): obj is Zone {
    return isString(obj);
}

export function isScenario(obj: Asset): obj is EditableScenario {
    return obj instanceof EditableScenario;
}

export function isStation(obj: Asset): obj is Station {
    return isDefined(obj)
        && obj instanceof Station;
}

export function isConnection(obj: Asset): obj is StationConnectionData {
    return isDefined(obj)
        && !isModel(obj)
        && !isSign(obj)
        && !isVideo(obj)
        && !isText(obj)
        && !isAudio(obj)
        && !isStation(obj)
        && !isZone(obj)
        && !isScenario(obj)
        && isDefined((obj as StationConnectionData).fromStationID)
        && isDefined((obj as StationConnectionData).toStationID);
}

export function getAssetKind(obj: FileAsset): FileAssetKind;
export function getAssetKind(obj: ResetableAsset): ResetableAssetKind;
export function getAssetKind(obj: DeletableAsset): DeletableAssetKind;
export function getAssetKind(obj: Asset): AssetKind;
export function getAssetKind(obj: Asset): AssetKind {
    if (isNullOrUndefined(obj)) {
        return null;
    }
    else if (isZone(obj)) {
        return "zone";
    }
    else if (isStation(obj)) {
        return "station";
    }
    else if (isAudio(obj)) {
        return obj.spatialize
            ? "ambientAudio"
            : "audio";
    }
    else if (isVideo(obj)) {
        return "video";
    }
    else if (isText(obj)) {
        return "text";
    }
    else if (isSign(obj)) {
        return "sign";
    }
    else if (isModel(obj)) {
        return "model";
    }
    else if (isConnection(obj)) {
        return "connection";
    }
    else if (isScenario(obj)) {
        return "scenario";
    }
    else {
        assertNever(obj);
    }
}

export class AssetEvent<EventT extends `asset${string}`, AssetT extends Asset = Asset> extends TypedEvent<EventT> {
    constructor(type: EventT, public readonly asset: AssetT) {
        super(type);
    }
}

export class AssetSelectedEvent<AssetT extends Asset = Asset> extends AssetEvent<"assetselected", AssetT>{
    constructor(asset: AssetT, public readonly isContextMenu: boolean) {
        super("assetselected", asset);
    }
}

export class AssetUpdatedEvent<AssetT extends DeletableAsset = DeletableAsset> extends AssetEvent<"assetupdated", AssetT> {
    constructor(asset: AssetT) {
        super("assetupdated", asset);
    }
}

export class AssetRenameEvent<AssetT extends DeletableAsset = DeletableAsset> extends AssetEvent<"assetrename", AssetT> {
    constructor(asset: AssetT, public readonly newName: string) {
        super("assetrename", asset);
    }
}

export class AssetDeleteEvent<AssetT extends DeletableAsset = DeletableAsset> extends AssetEvent<"assetdelete", AssetT>{
    constructor(asset: AssetT) {
        super("assetdelete", asset);
    }
}

export interface AssetEvents<AssetT extends DeletableAsset = DeletableAsset> {
    "assetrename": AssetRenameEvent<AssetT>;
    "assetdelete": AssetDeleteEvent<AssetT>;
}


export class AssetResetEvent<AssetT extends ResetableAsset = ResetableAsset> extends AssetEvent<"assetreset", AssetT> {
    constructor(asset: AssetT) {
        super("assetreset", asset);
    }
}

export interface ResetableAssetEvents<AssetT extends ResetableAsset = ResetableAsset> {
    "assetreset": AssetResetEvent<AssetT>;
}


export class AssetViewFileEvent<AssetT extends FileAsset = FileAsset> extends AssetEvent<"assetviewfile", AssetT> {
    constructor(asset: AssetT) {
        super("assetviewfile", asset);
    }
}

export interface FileAssetEvents<AssetT extends FileAsset = FileAsset> {
    "assetviewfile": AssetViewFileEvent<AssetT>;
}

export const assetIcons = new Map<AssetKind, string>([
    ["scenario", scroll.emojiStyle],
    ["zone", worldMap.emojiStyle],
    ["station", globeShowingAmericas.emojiStyle],
    ["ambientAudio", megaphone.emojiStyle],
    ["connection", upArrow.emojiStyle],
    ["sign", framedPicture.emojiStyle],
    ["audio", speakerHighVolume.emojiStyle],
    ["video", videoCamera.emojiStyle],
    ["text", memo.emojiStyle],
    ["model", joystick.emojiStyle]
]);

export const assetNames = new Map<DeletableAssetKind, string>([
    ["zone", "Zone"],
    ["station", "Station"],
    ["ambientAudio", "Environment Audio"],
    ["sign", "Sign"],
    ["audio", "Voice Over"],
    ["video", "Video Clip"],
    ["text", "Text"],
    ["model", "3D Model"],
    ["connection", "Station Connection"]
]);


export const assetDisplayNames = new Map<DeletableAssetKind | "delete" | "readonly", string>([
    ["delete", wastebasket.emojiStyle + " Delete"],
    ["readonly", cancelTag.emojiStyle + " Cannot edit published scenario"]
]);

for (const [key, value] of assetNames) {
    assetDisplayNames.set(key, assetIcons.get(key) + " " + value);
}

export const AssetKindValues = Array.from(assetIcons.keys());
export const DeletableAssetKindValues = Array.from(assetNames.keys());