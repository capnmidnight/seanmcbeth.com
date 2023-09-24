import { SphereEncodingName, StereoLayoutName } from "@juniper-lib/threejs/dist/VideoPlayer3D";
import { coallesce } from "@juniper-lib/collections/dist/coallesce";
import { deg2rad } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import type { FileData, TransformData, VideoClipData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Transform } from "../../../vr-apps/yarrow/Transform";
import { Video } from "../../../vr-apps/yarrow/Video";
import type { EditableScenario } from "../EditableScenario";
import { AssetSelectedEvent } from "../models";
import { BaseScenarioFileAssetAdapter } from "./BaseScenarioFileAssetAdapter";
import { EditableScenarioMarkerSelectedEvent } from "./StationAdapter";

const videoIcon = "clapper";

interface VideoCreateInput {
    fileID: number;
    parentTransformID: number;
}

interface VideoUpdateInput {
    fileName: string;
    id: number;
    enabled: boolean;
    label: string;
    volume: number;
    sphereEncodingName: SphereEncodingName;
    stereoLayoutName: StereoLayoutName;
}

interface VideoCreateOutput {
    videoClip: VideoClipData;
    transform: TransformData;
}

export class EditableScenarioVideoSelectedEvent extends EditableScenarioMarkerSelectedEvent<"video", Video> {
    constructor(video: Video) {
        super("video", video);
    }
}


export class VideosAdapter extends BaseScenarioFileAssetAdapter<Video, VideoCreateInput, VideoCreateOutput> {
    constructor(scenario: EditableScenario) {
        super(scenario, scenario.videos, scenario.videosByStation, "VideoClips");
    }

    protected override createAsset(output: VideoCreateOutput, download: IProgress): Promise<Video> {
        return this.scenario.createVideo(output.videoClip, download);
    }

    create(station: Station, file: FileData, prog?: IProgress): Promise<Video> {
        const [upload, download] = progressSplitWeighted(prog, [2, 1]);

        const input: VideoCreateInput = {
            fileID: file.id,
            parentTransformID: station.transformID
        };

        return this.createTransformAndSaveAsset(input, upload, download);
    }

    protected override getMarkerImagePath() {
        return videoIcon;
    }

    protected override onMarkerSelected(obj: Video, isContenxtMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioVideoSelectedEvent(obj));
        this.scenario.dispatchEvent(new AssetSelectedEvent(obj, isContenxtMenu));
    }

    protected override saveTransformThrottled(obj: Video, transform: Transform) {
        transform.scale.setScalar(obj.size);
        super.saveTransformThrottled(obj, transform);
        transform.scale.setScalar(1);
    }

    setSphereEncodingAndLayout(video: Video, sphereEncodingName: SphereEncodingName, stereoLayoutName: StereoLayoutName): boolean {
        if (!this.scenario.env.videoPlayer.isSupported(sphereEncodingName, stereoLayoutName)) {
            return false;
        }

        this.updateThrottled(video, {
            sphereEncodingName,
            stereoLayoutName
        });

        return true;
    }

    setSize(video: Video, size: number): void {
        video.size = size;
        const transform = this.scenario.getTransform(video.transformID);
        this.saveTransformThrottled(video, transform);
    }

    setRotation(video: Video, pitchDegrees: number, yawDegrees: number, rollDegrees: number): void {
        const transform = this.scenario.getTransform(video.transformID);
        transform.rotation.set(
            deg2rad(pitchDegrees),
            deg2rad(yawDegrees),
            deg2rad(rollDegrees),
            "XYZ");
        this.saveTransformThrottled(video, transform);
    }

    updateThrottled(video: Video, newData: Partial<VideoUpdateInput>): void {
        this.setUpdateData(newData, video);
        this.scenario.throttle(`updateVideo::${newData.id}`, () =>
            this.scenario.post("Update", "VideoClips", newData));
        this.getUpdateData(video, newData);
    }

    async update(video: Video, newData: Partial<VideoUpdateInput>): Promise<void> {
        this.setUpdateData(newData, video);
        await this.scenario.post("Update", "VideoClips", newData);
        this.getUpdateData(video, newData);
    }

    private copy(overwrite: boolean, to: Partial<VideoUpdateInput>, from: Partial<VideoUpdateInput>): void {
        coallesce(overwrite, to, from,
            "fileName",
            "sphereEncodingName",
            "stereoLayoutName",
            "enabled",
            "label",
            "volume");
    }

    private setUpdateData(newData: Partial<VideoUpdateInput>, video: Video) {
        newData.id = video.key;
        this.copy(false, newData, video);
    }

    private getUpdateData(video: Video, newData: Partial<VideoUpdateInput>) {
        this.copy(true, video, newData);

        if (isDefined(video.controls)) {
            video.controls.volume = newData.volume;
            video.controls.label = newData.label;
        }

        const clip = this.scenario.env.audio.getClip(video.transformID.toString());
        if (isDefined(clip)) {
            clip.volume = newData.volume;
        }
    }

    getStation(video: Video): Station {
        const transform = video && this.scenario.getTransform(video.transformID);
        return transform && this.scenario.findStation(transform);
    }
}