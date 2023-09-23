import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { objGraph } from "@juniper-lib/threejs/objects";
import { SphereEncodingName, StereoLayoutName, VideoPlayer3D } from "@juniper-lib/threejs/VideoPlayer3D";
import { Image2D } from "@juniper-lib/threejs/widgets/Image2D";
import { PlaybackButton } from "@juniper-lib/threejs/widgets/PlaybackButton";
import { DwellEventer } from "@juniper-lib/events/DwellEventer";
import { rad2deg } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/progressSplit";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/using";
import { FullVideoRecord } from "@juniper-lib/video/data";
import { YouTubeProxy } from "@juniper-lib/video/YouTubeProxy";
import { Object3D } from "three";
import { BaseScenario } from "./BaseScenario";
import { VideoClipData, Video_Vnd_DlsDc_YtDlp_Json } from "./data";

export class Video
    extends Object3D
    implements VideoClipData, IDisposable {
    readonly transformID: number;
    readonly key: number;
    readonly scenarioID: number;
    readonly fileID: number;
    readonly filePath: string;
    readonly fileTagString: string;
    readonly mediaType: string;
    readonly trueMediaType: string;
    readonly copyright: string;
    readonly copyrightDate: Date;
    fileName: string;
    label: string;
    volume: number;
    enabled: boolean;
    sphereEncodingName: SphereEncodingName;
    stereoLayoutName: StereoLayoutName;

    controls: PlaybackButton<FullVideoRecord> = null;
    data: FullVideoRecord = null;
    error: unknown = null;

    readonly thumbnail: Image2D;
    private readonly target: RayTarget;

    constructor(
        private readonly scenario: BaseScenario,
        private readonly proxy: YouTubeProxy,
        parent: Object3D,
        private readonly player: VideoPlayer3D,
        data: VideoClipData) {
        super();
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
        this.sphereEncodingName = data.sphereEncodingName;
        this.stereoLayoutName = data.stereoLayoutName;

        this.name = "video-" + data.fileName;

        objGraph(parent,
            objGraph(this,
                this.thumbnail = new Image2D(this.scenario.env, "thumbnail-" + data.fileName, "static")
            )
        );

        this.size = parent.scale.x;
        parent.scale.setScalar(1);

        this.target = new RayTarget(this);

        Object.seal(this);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.onDisposing();
            this.disposed = true;
        }
    }

    protected onDisposing() {
        if (isDefined(this.thumbnail)) {
            this.thumbnail.dispose();
        }

        if (isDefined(this.controls)) {
            this.controls.removeScope(this);
            this.controls.dispose();
        }
    }

    async load(prog: IProgress): Promise<void> {
        if (isDefined(this.error)) {
            return Promise.resolve();
        }

        try {
            const progs = progressSplitWeighted(prog, [10, 1]);
            if (Video_Vnd_DlsDc_YtDlp_Json.matches(this.mediaType)) {
                this.data = await this.proxy.loadData(this.filePath, progs.shift());
                const thumbnailImage = await this.scenario.env.fetcher
                    .get(this.data.thumbnail.url)
                    .image(this.data.thumbnail.contentType)
                    .then(unwrapResponse);
                this.thumbnail.setTextureMap(thumbnailImage);
                this.thumbnail.objectWidth = 1;
                this.thumbnail.mesh.renderOrder = 4;
            }

            const title = this.label
                || this.data && this.data.title && this.data.title.substring(0, 25)
                || this.fileName;

            objGraph(this,
                objGraph(this.controls = new PlaybackButton(
                    this.scenario.env,
                    this.scenario.env.uiButtons,
                    this.data || this.filePath,
                    this.filePath,
                    title,
                    this.volume,
                    this.player))
            );

            this.controls.object.renderOrder = 5;
            this.controls.object.position.y = -this.thumbnail.objectHeight / 2;
            this.controls.object.position.z = 0.01;

            const showHideVideo = (v: boolean) => () => {
                this.thumbnail.visible = !v;
                this.player.object.visible = v;
                if (v) {
                    this.scenario.log("play video", { id: this.transformID });
                    objGraph(this, this.player);
                    this.player.setStereoParameters(this.sphereEncodingName, this.stereoLayoutName);
                    this.player.object.position.set(0, 0, 0);
                    this.player.object.quaternion.identity();
                    this.target.addMeshes(...this.player.meshes);
                }
                else {
                    this.scenario.log("stop video", { id: this.transformID });
                    this.target.removeMeshes(...this.player.meshes);
                }
            };
            this.controls.addScopedEventListener(this, "play", showHideVideo(true));
            this.controls.addScopedEventListener(this, "stop", showHideVideo(false));

            const dweller = new DwellEventer();
            dweller.addEventListener("dwell", (evt) => {
                this.scenario.log("video viewed", { id: this.transformID, time: evt.dwellTimeSeconds });
            });

            this.target.addEventListener("enter", (evt) => {
                if (evt.pointer.type === "nose") {
                    dweller.start();
                }
            });

            this.target.addEventListener("exit", (evt) => {
                if (evt.pointer.type === "nose") {
                    dweller.stop();
                }
            });

            this.disposed = false;
        }
        catch (error) {
            this.error = error;
            this.dispose();
        }
    }

    async reload(prog?: IProgress): Promise<void> {
        this.dispose();
        await this.load(prog);
    }

    reset() {
        if (isDefined(this.error)) {
            return;
        }

        this.player.stop();

        if (isDefined(this.thumbnail)) {
            this.thumbnail.removeWebXRLayer();
        }
    }

    get size(): number {
        return this.scale.x;
    }

    set size(v: number) {
        this.scale.x
            = this.scale.y
            = v;
    }

    get rotationX(): number {
        return rad2deg(this.parent.rotation.x);
    }

    get rotationY(): number {
        return rad2deg(this.parent.rotation.y);
    }

    get rotationZ(): number {
        return rad2deg(this.parent.rotation.z);
    }
}