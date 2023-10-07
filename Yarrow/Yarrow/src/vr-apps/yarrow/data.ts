import { ILatLngPoint } from "@juniper-lib/gis/dist/LatLngPoint";
import { specialize } from "@juniper-lib/mediatypes/dist/util";
import { SphereEncodingName, StereoLayoutName } from "@juniper-lib/threejs/dist/VideoPlayer3D";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";

export interface BaseFileAssetData {
    fileID: number;
    fileName: string;
    filePath: string;
    fileTagString: string;
    mediaType: string;
    trueMediaType: string;
    copyright: string;
    copyrightDate: Date;
}

export interface BaseScenarioFileAssetData extends BaseFileAssetData {
    key: number;
    scenarioID: number;
    transformID: number;
}

export interface BaseMediaAssetData extends BaseScenarioFileAssetData {
    volume: number;
    enabled: boolean;
    label: string;
}

export interface BaseResource {
    id: number;
    name: string;
}

export type Zone = string;

export interface AudioTrackData extends BaseMediaAssetData {
    zone: Zone;
    effect: string;
    minDistance: number;
    maxDistance: number;
    spatialize: boolean;
}

export interface EmojiData {
    value: string;
    desc: string;
}

export interface FileData {
    id: number;
    name: string;
    mediaType: string;
    filePath: string;
    size: number;
    sizeString: string;
    tagsString: string;
    copyright: string;
    copyrightDate: Date;
}

export interface ScenarioGroupData extends BaseResource {
    languageID: number;
    languageName: string;
    latestVersion: ScenarioData;
}

export interface ScenarioData extends BaseResource {
    languageName: string;
    startRotation: number;
    startStationID: number;
    origin: ILatLngPoint;
    version: number;
    published: boolean;
}

export interface ScenarioVersionData {
    id: number;
    version: number;
    published: boolean;
}

export interface FullScenarioData extends ScenarioData {
    versions: ScenarioVersionData[];
    transforms: TransformData[];
    stations: StationData[];
    connections: StationConnectionData[];
    audioTracks: AudioTrackData[];
    videoClips: VideoClipData[];
    texts: TextData[];
    signs: SignData[];
    models: ModelData[];
    roomName: string;
}

export interface HeadsetData {
    headsetID: number;
    locationID: number;
    purchasePrice?: number;
    name: string;
    serialNumber: string;
    model: string;
    locationDescription: string;
    notes: string;
    locationStartDate: Date;
    locationEndDate?: Date;
    purchaseDate?: Date;
    trackingNumber: string;
    isUPSTrackingNumber: boolean;
    isFedExTrackingNumber: boolean;
    trackingLink: string;
    purchasePriceUSD: string;
}

export interface LanguageData extends BaseResource {

}

export interface FullLanguageData extends LanguageData {
    scenarios: FullScenarioData[];
}

export interface MenuItemData {
    id: number;
    label: string;
    order: number;
    organizationName: string;

    parentID?: number;

    fileID?: number;
    filePath?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    scenarioGroupID?: number;
    scenarioID?: number;
    audioElementCount?: number;
    videoElementCount?: number;
}

export interface ModelData extends BaseScenarioFileAssetData {

}

export interface SignData extends BaseScenarioFileAssetData {
    isCallout: boolean;
    alwaysVisible: boolean;
}

export interface TextData extends BaseScenarioFileAssetData {
    isCallout: boolean;
    alwaysVisible: boolean;
}

export interface GeographicData extends BaseFileAssetData {
    location: ILatLngPoint;
}

export function isGeographicData(obj: BaseFileAssetData): obj is GeographicData {
    return isDefined(obj)
        && isDefined((obj as GeographicData).location);
}

export interface PhotosphereMetadata extends GeographicData {
    status: number | string;
    copyright: string;
    date: string;
    pano_id: string;
    errorMessage: string;
}

export interface StationData extends BaseScenarioFileAssetData, GeographicData {
    zone: Zone;
    label: string;
    rotation: number[];
}

export function isScenarioFileAssetData(obj: BaseFileAssetData): obj is BaseScenarioFileAssetData {
    return isDefined(obj)
        && isDefined((obj as BaseScenarioFileAssetData).transformID);
}

export interface StationConnectionData {
    fromStationID: number;
    toStationID: number;
    transformID?: number;
    label?: string;
}

export interface TransformData {
    id: number;
    parentTransformID: number;
    name: string;
    matrix: number[];
}

export interface VideoClipData extends BaseMediaAssetData {
    sphereEncodingName: SphereEncodingName;
    stereoLayoutName: StereoLayoutName;
}

export interface DeleteOp {
    audioTracks?: number[];
    connections?: [number, number][];
    models?: number[];
    signs?: number[];
    stations?: number[];
    transforms?: number[];
    videoClips?: number[];
    texts?: number[];
}

export const Video_Vnd_Yarrow_YtDlp_Json = /*@__PURE__*/ specialize("video")("vnd.yarrow.ytdlp+json", "ytdlp.json", "ytdlp", "json");
export const Image_Vendor_Google_StreetView_Pano = /*@__PURE_*/ specialize("image")("vnd.google.streetview.pano");