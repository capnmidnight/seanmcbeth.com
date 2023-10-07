import { coallesce } from "@juniper-lib/collections/dist/coallesce";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { Audio } from "../../../vr-apps/yarrow/Audio";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { AudioTrackData, FileData, TransformData } from "../../../vr-apps/yarrow/data";
import { AssetSelectedEvent } from "../models";
import type { EditableScenario } from "./../EditableScenario";
import { BaseScenarioFileAssetAdapter } from "./BaseScenarioFileAssetAdapter";
import { EditableScenarioMarkerSelectedEvent } from "./StationAdapter";

const audioIcon = "sound";
const environmentAudioIcon = "disc";

export class EditableScenarioAudioSelectedEvent extends EditableScenarioMarkerSelectedEvent<"audio", Audio> {
    constructor(public audio: Audio) {
        super("audio", audio);
    }
}

interface AudioTrackCreateInput {
    fileID: number;
    parentTransformID: number;
    spatialize: boolean;
}

export interface AudioTrackUpdateInput {
    id: number;
    fileName: string;
    enabled: boolean;
    label: string;
    minDistance: number;
    maxDistance: number;
    volume: number;
    zone: string;
    effect: string;
}

interface AudioTrackCreateOutput {
    audioTrack: AudioTrackData;
    transform: TransformData;
}

export class AudiosAdapter
    extends BaseScenarioFileAssetAdapter<Audio, AudioTrackCreateInput, AudioTrackCreateOutput> {

    constructor(scenario: EditableScenario) {
        super(scenario, scenario.audios, scenario.audiosByStation, "AudioTracks");

        this.addEventListener("transformmoved", (evt) => {
            if (evt.object.spatialize) {
                evt.object.updateAudioPosition();
            }
        });
    }

    protected override createAsset(output: AudioTrackCreateOutput, download: IProgress): Promise<Audio> {
        return this.scenario.createAudio(output.audioTrack, download);
    }

    create(station: Station, file: FileData, prog?: IProgress): Promise<Audio> {
        const [upload, download] = progressSplitWeighted(prog, [2, 1]);
        const parent = station || this.scenario.rootTransform;
        const input: AudioTrackCreateInput = {
            fileID: file.id,
            spatialize: parent !== station,
            parentTransformID: parent.transformID
        };

        return this.createTransformAndSaveAsset(input, upload, download);
    }

    protected override getMarkerImagePath(obj: Audio) {
        return obj.spatialize
            ? environmentAudioIcon
            : audioIcon;
    }

    protected override onMarkerSelected(obj: Audio, isContenxtMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioAudioSelectedEvent(obj));
        this.scenario.dispatchEvent(new AssetSelectedEvent(obj, isContenxtMenu));
    }

    changeElevationThrottled(audio: Audio, elevation: number) {
        const { transform, latLng } = this.setChangeElevationData(audio);
        this.moveTransformThrottled(audio, transform, latLng.lat(), latLng.lng(), elevation);
    }

    async changeElevation(audio: Audio, elevation: number): Promise<void> {
        const { transform, latLng } = this.setChangeElevationData(audio);
        await this.moveTransform(audio, transform, latLng.lat(), latLng.lng(), elevation);
    }

    private setChangeElevationData(audio: Audio) {
        const marker = this.scenario.fileMarkers.get(audio.transformID);
        const latLng = marker.getPosition();
        const transform = this.scenario.getTransform(audio.transformID);
        return { transform, latLng };
    }

    override async createEditorAssets(audio: Audio) {
        await super.createEditorAssets(audio);

        if (audio.spatialize
            && audio.zone === this.scenario.curZone) {
            audio.play();
        }
    }

    override resetThrottled(audio: Audio, defaultAvatarHeight: number): void {
        const y = audio.spatialize ? 0 : defaultAvatarHeight;
        super.resetThrottled(audio, y);
    }

    override async reset(audio: Audio, defaultAvatarHeight: number): Promise<void> {
        const y = audio.spatialize ? 0 : defaultAvatarHeight;
        await super.reset(audio, y);
    }

    updateThrottled(audio: Audio, newData: Partial<AudioTrackUpdateInput>): void {
        this.setUpdateData(newData, audio);
        this.scenario.throttle(`updateAudioTrack::${newData.id}`, () =>
            this.scenario.post("Update", "AudioTracks", newData));
        this.getUpdateData(audio, newData);
    }

    async update(audio: Audio, newData: Partial<AudioTrackUpdateInput>): Promise<void> {
        this.setUpdateData(newData, audio);
        await this.scenario.post("Update", "AudioTracks", newData);
        this.getUpdateData(audio, newData);
    }

    private copy(overwrite: boolean, to: Partial<AudioTrackUpdateInput>, from: Partial<AudioTrackUpdateInput>) {
        coallesce(overwrite, to, from,
            "fileName",
            "enabled",
            "label",
            "minDistance",
            "maxDistance",
            "volume",
            "zone",
            "effect");
    }

    private setUpdateData(newData: Partial<AudioTrackUpdateInput>, audio: Audio) {
        newData.id = audio.key;
        this.copy(false, newData, audio);
    }

    private getUpdateData(audio: Audio, newData: Partial<AudioTrackUpdateInput>) {
        this.copy(true, audio, newData);

        if (isDefined(audio.controls)) {
            audio.controls.volume = newData.volume;
            audio.controls.label = newData.label;
        }

        const clip = this.scenario.env.audio.getClip(audio.transformID.toString());
        if (isDefined(clip)) {
            clip.volume = newData.volume;
            clip.spatializer.setAudioProperties(
                newData.minDistance,
                newData.maxDistance,
                this.scenario.env.audio.algorithm);
            clip.setEffects(newData.effect);

            if (newData.enabled
                && newData.zone === this.scenario.curZone) {
                if (clip.playbackState !== "playing") {
                    clip.play();
                }
            }
            else {
                if (clip.playbackState !== "stopped") {
                    clip.stop();
                }
            }
        }
    }

    getStation(audio: Audio): Station {
        const transform = audio && this.scenario.getTransform(audio.transformID);
        return transform && this.scenario.findStation(transform);
    }

    override async delete(audio: Audio): Promise<void> {
        const { zone, clip } = audio;
        await super.delete(audio);
        if (audio.spatialize) {
            this.scenario.zonedClips.remove(zone, clip);
        }
    }
}