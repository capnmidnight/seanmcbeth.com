import { FullAudioRecord } from "@juniper-lib/audio/dist/data";
import { AudioElementSource } from "@juniper-lib/audio/dist/sources/AudioElementSource";
import { AudioPlayer } from "@juniper-lib/audio/dist/sources/AudioPlayer";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { PlaybackButton } from "@juniper-lib/threejs/dist/widgets/PlaybackButton";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/dist/using";
import { Object3D, Vector3 } from "three";
import { BaseScenario } from "./BaseScenario";
import { AudioTrackData } from "./data";

const P = new Vector3();

export class Audio implements AudioTrackData, IDisposable {
    readonly scenarioID: number;
    readonly key: number;
    readonly fileID: number;
    readonly filePath: string;
    readonly fileTagString: string;
    readonly mediaType: string;
    readonly trueMediaType: string;
    readonly copyright: string;
    readonly copyrightDate: Date;
    readonly spatialize: boolean;
    readonly transformID: number;
    zone: string;
    minDistance: number;
    maxDistance: number;
    effect: string;
    label: string;
    volume: number;
    enabled: boolean;
    fileName: string;

    clip: AudioElementSource = null;
    controls: PlaybackButton<FullAudioRecord> = null;

    error: unknown = null;

    constructor(private readonly scenario: BaseScenario,
        public readonly parent: Object3D,
        private readonly player: AudioPlayer,
        data: AudioTrackData) {
        this.zone = data.zone;
        this.minDistance = data.minDistance;
        this.maxDistance = data.maxDistance;
        this.spatialize = data.spatialize;
        this.effect = data.effect;
        this.label = data.label;
        this.volume = data.volume;
        this.enabled = data.enabled;
        this.transformID = data.transformID;
        this.key = data.key;
        this.scenarioID = data.scenarioID;
        this.fileID = data.fileID;
        this.fileName = data.fileName;
        this.filePath = data.filePath;
        this.fileTagString = data.fileTagString;
        this.mediaType = data.mediaType;
        this.trueMediaType = data.trueMediaType;
        this.copyright = data.copyright;
        this.copyrightDate = data.copyrightDate;
    }

    private get effects(): string[] {
        if (isNullOrUndefined(this.effect)) {
            return [];
        }
        else {
            return this.effect
                .split(',')
                .map(f => f.trim())
                .filter(f => f.length > 0);
        }
    }

    async load(prog: IProgress): Promise<void> {
        if (isDefined(this.error)) {
            return Promise.resolve();
        }

        this.disposed = false;

        try {
            if (this.spatialize) {
                this.clip = await this.scenario.env.audio.createClip(
                    this.transformID.toString(),
                    this.filePath,
                    this.spatialize,
                    this.spatialize,
                    this.spatialize,
                    this.spatialize,
                    this.volume,
                    this.effects,
                    prog);

                this.clip.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.scenario.env.audio.algorithm);
                this.updateAudioPosition();
            }
            else {
                objGraph(this.parent,
                    this.controls = new PlaybackButton(
                        this.scenario.env,
                        this.scenario.env.uiButtons,
                        this.filePath,
                        `${this.fileName}(${this.transformID})`,
                        this.label,
                        this.volume,
                        this.player)
                );

                this.controls.addScopedEventListener(this, "play", () => {
                    this.scenario.log("play audio", { id: this.transformID });
                });

                this.controls.addScopedEventListener(this, "stop", () => {
                    this.scenario.log("stop audio", { id: this.transformID });
                });
            }
        }
        catch (error) {
            this.error = error;
            this.dispose();
        }
    }

    async reload(prog?: IProgress): Promise<void> {
        const isPlaying = this.clip && this.clip.playbackState === "playing";
        this.dispose();
        this.player.cacheBust(this.filePath);
        await this.load(prog);
        if (isPlaying) {
            this.clip.play();
        }
    }

    updateAudioPosition(): void {
        this.parent.getWorldPosition(P);
        this.scenario.env.audio.setClipPosition(this.transformID.toString(), P.x, P.y, P.z);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.onDisposing();
            this.disposed = true;
        }
    }

    protected onDisposing() {
        if (isDefined(this.clip)) {
            this.scenario.env.audio.removeClip(this.transformID.toString());
            this.clip = null;
        }

        if (isDefined(this.controls)) {
            this.controls.removeScope(this);
            this.controls.object.removeFromParent();
            this.controls.dispose();
            this.controls = null;
        }
    }

    play(): Promise<void> {
        if (isDefined(this.error)) {
            return Promise.resolve();
        }

        if (isDefined(this.clip)) {
            return this.clip.play();
        }

        return this.controls.clickPlay();
    }

    reset() {
        if (isDefined(this.error)) {
            return;
        }

        if (isDefined(this.clip)) {
            this.clip.stop();
        }
        else {
            this.player.stop();
        }
    }
}