import { FullAudioRecord } from "@juniper-lib/audio/data";
import { AudioElementSource } from "@juniper-lib/audio/sources/AudioElementSource";
import { PriorityList } from "@juniper-lib/collections/PriorityList";
import { PriorityMap } from "@juniper-lib/collections/PriorityMap";
import { arrayClear, arrayScan } from "@juniper-lib/collections/arrays";
import { CanvasImageTypes, isImageBitmap } from "@juniper-lib/dom/canvas";
import { CancelSignalException, CancelToken } from "@juniper-lib/events/CancelToken";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/EventBase";
import { WindowQuitEventer } from "@juniper-lib/events/WindowQuitEventer";
import { all } from "@juniper-lib/events/all";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { LatLngPoint } from "@juniper-lib/gis/LatLngPoint";
import { UTMPoint } from "@juniper-lib/gis/UTMPoint";
import { PDFImage } from "@juniper-lib/graphics2d/PDFImage";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { progressOfArray } from "@juniper-lib/progress/progressOfArray";
import { progressSplitWeighted } from "@juniper-lib/progress/progressSplit";
import { progressTasksWeighted } from "@juniper-lib/progress/progressTasks";
import { LRUCache } from "@juniper-lib/threejs/LRUCache";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/PhotosphereRig";
import { cleanup } from "@juniper-lib/threejs/cleanup";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { XRTimerTickEvent } from "@juniper-lib/threejs/environment/XRTimer";
import { objGraph } from "@juniper-lib/threejs/objects";
import { PlaybackButton } from "@juniper-lib/threejs/widgets/PlaybackButton";
import { IDataLogger } from "@juniper-lib/tslib/IDataLogger";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/using";
import { YouTubeProxy } from "@juniper-lib/video/YouTubeProxy";
import { Object3D, Vector3 } from "three";
import { getScriptUrl } from "../../settings";
import { Audio } from "./Audio";
import { Connection } from "./Connection";
import { Model } from "./Model";
import { Sign } from "./Sign";
import { Station } from "./Station";
import { IPhotosphereRig } from "./StreetViewPhotosphereRig";
import { Text } from "./Text";
import { Transform } from "./Transform";
import { Video } from "./Video";
import { createPhotosphereCaptureRig } from "./createPhotosphereCaptureRig";
import {
    AudioTrackData,
    FullScenarioData,
    Image_Vendor_Google_StreetView_Pano,
    ModelData,
    SignData,
    StationConnectionData,
    StationData,
    TextData,
    TransformData,
    VideoClipData
} from "./data";
import { makeProxyURL } from "./proxy";

export class ScenarioNavigateEvent extends TypedEvent<"navigate"> {
    constructor(public station: Station) {
        super("navigate");
    }
}

export class PresentEvent<T extends Object3D> extends Event {
    source: T;
    constructor(source: T) {
        super("present");

        this.source = source;
        Object.seal(this);
    }
}

export interface ScenarioEvents {
    navigate: ScenarioNavigateEvent;
    present: PresentEvent<Object3D>;
}

export abstract class BaseScenario<EventsType = unknown>
    extends TypedEventBase<EventsType & ScenarioEvents>
    implements IDisposable, IDataLogger {

    readonly yt: YouTubeProxy;

    readonly transforms: TransformData[];
    readonly connections: StationConnectionData[];
    readonly stations = new Array<Station>();
    readonly signs = new Array<Sign>();
    readonly videos = new Array<Video>();
    readonly texts = new Array<Text>();
    readonly audios = new Array<Audio>();
    readonly models = new Array<Model>();

    get isEmpty() {
        return this.stations.length === 0
            && this.connections.length === 0
            && this.signs.length === 0
            && this.videos.length === 0
            && this.texts.length === 0
            && this.audios.length === 0
            && this.models.length === 0;
    }

    readonly signsByStation = new PriorityList<Station, Sign>();
    readonly videosByStation = new PriorityList<Station, Video>();
    readonly textsByStation = new PriorityList<Station, Text>();
    readonly audiosByStation = new PriorityList<Station, Audio>();
    readonly modelsByStation = new PriorityList<Station, Model>();
    readonly curConnections = new PriorityMap<Station, Station, Connection>();
    readonly transformsByTransformID = new Map<number, Transform>();
    readonly zonedClips = new PriorityList<string, AudioElementSource>();
    readonly playbackButtons = new Map<Object3D, PlaybackButton<FullAudioRecord>>();

    protected videosReady: Promise<void> = null;
    protected cancellationToken: CancelToken = null;

    rig: IPhotosphereRig;
    curStationID: number = null;
    curZone: string = null;
    startStationID: number;
    startRotation: number;

    private rootTransformID: number = null;

    get rootTransform(): Transform {
        return this.transformsByTransformID.get(this.rootTransformID);
    }

    private __originLL: LatLngPoint = null;
    protected get _originLL(): LatLngPoint {
        return this.__originLL;
    }

    protected set _originLL(v: LatLngPoint) {
        this.__originLL = v;
        if (isDefined(v)) {
            this._originUTM = this.originLL.toUTM();
        }
        else {
            this._originUTM = null;
        }
    }

    get originLL(): LatLngPoint {
        return this._originLL;
    }

    private _originUTM: UTMPoint = null;
    get originUTM(): UTMPoint {
        return this._originUTM;
    }


    get id(): number {
        return this.data.id;
    }

    get name(): string {
        return this.data.name;
    }

    get version() {
        return this.data.version;
    }

    get published() {
        return this.data.published;
    }

    get roomName(): string {
        return this.data.roomName;
    }

    private readonly windowQuitter = new WindowQuitEventer();

    constructor(public readonly env: Environment, private readonly dataLogger: IDataLogger, protected readonly data: FullScenarioData) {
        super();

        this.imgCache.addEventListener("itemevicted", (evt) => {
            if (isImageBitmap(evt.value)) {
                evt.value.close();
            }
        });

        this.yt = new YouTubeProxy(this.env.fetcher, makeProxyURL);

        if (isDefined(data.origin)) {
            this._originLL = new LatLngPoint(data.origin);
        }

        this.startStationID = data.startStationID;
        this.startRotation = data.startRotation;

        this.transforms = data.transforms;
        this.connections = data.connections;

        this.env.addScopedEventListener(this, "environmentaudiotoggled", () => {
            this.environmentAudioMuted = env.environmentAudioMuted;
        });

        let quit = false;
        const onQuit = () => {
            if (!quit) {
                quit = true;
                this.logLeaveStation();
                this.log("leave scenario", { id: this.id });
            }
        };

        this.env.addScopedEventListener(this, "quitting", onQuit);
        this.windowQuitter.addScopedEventListener(this, "quitting", onQuit);

        this.env.addScopedEventListener(this, "sceneclearing", () => {
            this.pauseCurrentAudioZone();
            this.curZone = null;
        });

        this.env.avatar.addScopedEventListener(this, "avatarreset", () => {
            this.moveToStation(this.curStation);
        });
    }

    async loadAssets(prog?: IProgress) {
        this.cancellationToken = new CancelToken();
        this.clearCache();

        this.rig = await createPhotosphereCaptureRig(this.env.fetcher, this.cancellationToken);
        this.rig.init(location.href, this.env.DEBUG);

        prog = prog || this.env.loadingBar;

        const [pdfJSProg, assetProg] = progressSplitWeighted(prog, [1, 100]);

        await PDFImage.prepare(getScriptUrl("pdfjs"), this.env.fetcher, this.env.DEBUG, pdfJSProg);

        /////////// BUILD SCENE OBJECTS ///////////
        for (const transformData of this.data.transforms) {
            this.addTransformData(transformData);
        }

        /////////// BUILD SCENE GRAPH ///////////
        for (const transformData of this.data.transforms) {
            if (transformData.parentTransformID === 0) {
                this.rootTransformID = transformData.id;
            }
            else {
                const parent = this.getTransform(transformData.parentTransformID);
                const child = this.getTransform(transformData.id);
                parent.attach(child);
            }
        }

        /////////// BUILD VIDEO CLIPS /////////////
        // This is done separately from loading  //
        // the other data because of the near-   //
        // constant delay that yt-dlp introduces //
        // in fetching the metadata for the      //
        // videos. Once the metadata is fetched, //
        // the videos are nearly ready to play,  //
        // so we can hide the latency behind the //
        // rest of the assets loading.           //
        ///////////////////////////////////////////
        const [otherAssetProg, videoAssetProg] = progressSplitWeighted(assetProg, [10, 1]);
        this.videosReady = progressOfArray(videoAssetProg, this.data.videoClips, (videoClip: VideoClipData, prog: IProgress) =>
            this.createVideo(videoClip, prog)
                .catch(exp => {
                    if (exp instanceof CancelSignalException) {
                        console.warn("Late load cancellation occured");
                    }
                    else {
                        throw exp;
                    }
                })).then(() => null);

        await progressTasksWeighted(otherAssetProg, [
            /////////// BUILD STATIONS ///////////
            [this.data.stations.length, (prog: IProgress) => progressOfArray(prog, this.data.stations, (station: StationData, prog: IProgress) => this.createStation(station, prog))],

            /////////// BUILD SIGNS ///////////
            [this.data.signs.length, (prog: IProgress) => progressOfArray(prog, this.data.signs, (sign: SignData, prog: IProgress) => this.createSign(sign, prog))],

            /////////// BUILD MODELS ///////////
            [this.data.models.length, (prog: IProgress) => progressOfArray(prog, this.data.models, (model: ModelData, prog: IProgress) => this.createModel(model, prog))],

            /////////// BUILD AUDIO TRACKS ///////////
            [this.data.audioTracks.length, (prog: IProgress) => progressOfArray(prog, this.data.audioTracks, (audioTrack: AudioTrackData, prog: IProgress) => this.createAudio(audioTrack, prog))],

            /////////// BUILD TEXTS ///////////
            [this.data.texts.length, (prog: IProgress) => progressOfArray(prog, this.data.texts, (text: TextData, prog: IProgress) => this.createText(text, prog))]
        ]);

        /////////// BUILD STATION EXITS ///////////
        for (const connection of this.data.connections) {
            this.createConnection(connection);
        }

        this.env.addScopedEventListener(this, "update", (evt) => this.update(evt));
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this.cancellationToken) {
                this.cancellationToken.cancel();
            }

            this.env.infoLabel.image.clear();

            this.pauseCurrentAudioZone();
            this.env.removeScope(this);
            this.env.avatar.removeScope(this);

            for (const audio of this.audios) {
                audio.dispose();
            }

            for (const sign of this.signs) {
                sign.dispose();
            }

            for (const model of this.models) {
                model.dispose();
            }

            for (const video of this.videos) {
                video.dispose();
            }

            for (const text of this.texts) {
                text.dispose();
            }

            const root = this.transformsByTransformID.get(this.rootTransformID);
            root.removeFromParent();
            cleanup(root);

            this.transformsByTransformID.clear();
            this.signsByStation.clear();
            this.audiosByStation.clear();
            this.videosByStation.clear();
            this.textsByStation.clear();
            this.modelsByStation.clear();
            this.zonedClips.clear();
            arrayClear(this.audios);
            arrayClear(this.videos);
            arrayClear(this.texts);
            arrayClear(this.signs);
            arrayClear(this.models);

            this.windowQuitter.removeScope(this);
            this.disposed = true;
        }
    }

    private get avatarHeightOffset() {
        return this.env.avatar.height - this.env.defaultAvatarHeight;
    }

    update(evt: XRTimerTickEvent) {
        const signs = this.signsByStation.get(this.curStation);
        for (const sign of signs) {
            sign.update(evt.dt);
        }

        const texts = this.textsByStation.get(this.curStation);
        for (const text of texts) {
            text.update(evt.dt);
        }
    }

    private _muteEnvAudio = false;
    get environmentAudioMuted() {
        return this._muteEnvAudio;
    }

    set environmentAudioMuted(v: boolean) {
        if (v !== this.environmentAudioMuted) {
            this._muteEnvAudio = v;
            if (this.environmentAudioMuted) {
                this.pauseCurrentAudioZone();
            }
            else {
                this.playCurrentAudioZone();
            }
        }
    }

    addTransformData(transformData: TransformData) {
        const transform = new Transform(transformData);
        this.transformsByTransformID.set(transform.transformID, transform);
        return transform;
    }

    getTransform(transformID: number): Transform {
        return this.transformsByTransformID.get(transformID);
    }

    getStation(stationID: number): Station {
        return arrayScan(this.stations, s => s.transformID === stationID);
    }

    get curStation(): Station {
        return this.getStation(this.curStationID);
    }

    get startStation(): Station {
        return this.getStation(this.startStationID);
    }

    async createStation(data: StationData, prog?: IProgress): Promise<Station> {
        if (prog) {
            prog.end();
        }
        const station = new Station(this, data);
        this.stations.push(station);
        return station;
    }

    async createConnection(data: StationConnectionData): Promise<Connection> {
        try {
            const fromStation = this.getStation(data.fromStationID);
            const toStation = this.getStation(data.toStationID);
            const fromTransform = this.getTransform(fromStation.transformID);
            const toTransform = this.getTransform(toStation.transformID);
            let transform = this.getTransform(data.transformID);
            if (isNullOrUndefined(transform)) {
                data.transformID = -this.transforms.length;
                const transformData = {
                    id: data.transformID,
                    name: `nav-icon-from-${fromTransform.name}-to-${toTransform.name}`,
                    matrix: Connection.calcMatrix(fromTransform, toTransform, this.env.defaultAvatarHeight).toArray(),
                    parentTransformID: fromStation.transformID
                };
                this.transforms.push(transformData);
                transform = this.addTransformData(transformData);
                objGraph(fromTransform, transform);
            }

            const icon = new Connection(this.env, transform, fromTransform, toTransform, data.label);
            icon.addEventListener("click", () => {
                this.dispatchEvent(new ScenarioNavigateEvent(toStation));
                this.showStation(toStation, true, this.env.loadingBar);
            });

            this.curConnections.add(fromStation, toStation, icon);
            return icon;
        }
        catch (err) {
            console.error({ task: "createConnection", err, data });
            return null;
        }
    }

    async createSign(data: SignData, prog?: IProgress): Promise<Sign> {
        const transform = this.getTransform(data.transformID);
        const sign = new Sign(this, data, transform);
        this.signs.push(sign);

        await sign.load(prog);
        this.cancellationToken.check();

        const station = this.findStation(sign);
        this.signsByStation.add(station, sign);
        return sign;
    }

    async createModel(data: ModelData, prog?: IProgress): Promise<Model> {
        const transform = this.getTransform(data.transformID);
        const obj = new Model(this, data, transform);
        this.models.push(obj);

        await obj.load(prog);
        this.cancellationToken.check();

        const station = this.findStation(obj);
        this.modelsByStation.add(station, obj);
        return obj;
    }

    async createAudio(data: AudioTrackData, prog?: IProgress): Promise<Audio> {
        const transform = this.getTransform(data.transformID);
        const audio = new Audio(this, transform, this.env.audioPlayer, data);
        this.audios.push(audio);

        const station = this.findStation(audio.parent);
        this.audiosByStation.add(station, audio);

        await audio.load(prog);
        this.cancellationToken.check();

        if (isDefined(audio.controls)) {
            this.playbackButtons.set(audio.parent, audio.controls);

            if (isNullOrUndefined(audio.error)) {
                audio.controls.addEventListener("play", () => this.pauseCurrentAudioZone());
                audio.controls.addEventListener("stop", () => this.playCurrentAudioZone());
            }
        }

        if (isDefined(audio.clip)) {
            this.zonedClips.add(audio.zone, audio.clip);
        }

        return audio;
    }

    async createVideo(data: VideoClipData, prog?: IProgress): Promise<Video> {
        const transform = this.getTransform(data.transformID);
        const video = new Video(this, this.yt, transform, this.env.videoPlayer, data);
        this.videos.push(video);
        await video.load(prog);
        this.cancellationToken.check();
        this.playbackButtons.set(video.parent, video.controls);

        const station = this.findStation(video.parent);
        this.videosByStation.add(station, video);

        if (isNullOrUndefined(video.error)) {
            video.controls.addEventListener("play", () => this.pauseCurrentAudioZone());
            video.controls.addEventListener("stop", () => this.playCurrentAudioZone());
        }

        return video;
    }

    async createText(data: TextData, prog?: IProgress): Promise<Text> {
        const transform = this.getTransform(data.transformID);
        const text = new Text(this, data, transform);
        this.texts.push(text);

        await text.load(prog);
        this.cancellationToken.check();

        const station = this.findStation(text);
        this.textsByStation.add(station, text);
        return text;
    }

    getConnectionLabel(fromStation: Station, toStation: Station): string {
        if (isNullOrUndefined(fromStation)
            || isNullOrUndefined(toStation)) {
            return null;
        }

        for (const connection of this.connections) {
            if (connection.fromStationID === fromStation.transformID
                && connection.toStationID === toStation.transformID) {
                return connection.label;
            }
        }

        return null;
    }

    private getStationByObject(obj: Object3D | Transform): Station {
        if (obj instanceof Transform) {
            return this.getStation(obj.transformID);
        }

        return null;
    }

    findStation(obj: Object3D): Station {
        let station = this.getStationByObject(obj);
        while (!station && obj != null) {
            obj = obj.parent;
            station = this.getStationByObject(obj);
        }

        return station;
    }

    protected getStationCenter(station: Station): Vector3 {
        const v = new Vector3();
        const stTransform = this.getTransform(station.transformID);
        if (stTransform) {
            stTransform.getWorldPosition(v);
        }

        v.y += this.env.defaultAvatarHeight;

        return v;
    }

    get visible(): boolean {
        return isDefined(this.rootTransform.parent);
    }

    set visible(v: boolean) {
        if (v !== this.visible) {
            if (v) {
                this.curStationID = null;

                if (this.rootTransform == null) {
                    throw new Error("No root transform");
                }

                objGraph(this.env.foreground, this.rootTransform);

                /////////// INITIALLY HIDE ALL STATIONS ///////////
                for (const station of this.stations) {
                    const here = this.getTransform(station.transformID);
                    here.visible = false;
                }
            }
            else {
                this.env.foreground.remove(this.rootTransform);
            }
        }
    }

    async showStart(stationProg?: IProgress) {
        this.visible = true;

        if (this.startStationID == null) {
            throw new Error("Scenario has no starting point");
        }

        this.log("start scenario", { id: this.id });
        await this.showStation(this.startStation, false, stationProg);
        this.env.avatar.setHeadingImmediate(this.startRotation);
    }

    async showStation(station: Station, playTransitionSound: boolean, prog?: IProgress) {
        this.logLeaveStation();
        this.log("show station", { id: station.transformID });

        if (this.curStationID) {
            const station = this.getStation(this.curStationID);
            this.resetStationAssets(station);
        }

        prog = prog || this.env.loadingBar;
        this.curStationID = station.transformID;
        const stepoutTask = playTransitionSound
            ? this.env.audio.playClipThrough("footsteps")
            : Promise.resolve();

        const isCached = await this.isCached(station.filePath);
        this.env.loadingBar.enabled = !isCached;
        await this.env.withFade(async () => {

            this.env.skybox.rotation = station.rotation;
            const images = await this.getImage(station.filePath, prog);
            if (images.length === 6) {
                await this.env.skybox.setImages(station.filePath, images);
            }
            else {
                await this.env.skybox.setImage(station.filePath, images[0]);
            }

            this.moveToStation(station);

            for (const otherStation of this.stations) {
                const there = this.getTransform(otherStation.transformID);
                there.visible = otherStation.transformID === station.transformID;
            }

            const connections = this.curConnections.get(station);
            const toStations = this.getConnectedStations(station);
            for (const toStation of toStations) {
                this.prefetchConnectedStation(connections, toStation);
            }

            this.resetStationAssets(station);

            this.env.infoLabel.image.value = station.label || station.fileName;

            await all(
                this.playAudioZone(station.zone),
                stepoutTask
            );
        });

        this.env.loadingBar.enabled = false;
    }

    private logLeaveStation() {
        if (this.curStationID) {
            this.log("leave station", { id: this.curStationID });
        }
    }

    private moveToStation(station: Station) {
        if (isDefined(station)) {
            const here = this.getTransform(station.transformID);
            here.getWorldPosition(this.env.stage.position);
            this.env.stage.position.y -= this.avatarHeightOffset;
        }
    }

    private resetStationAssets(station: Station) {
        const signs = this.signsByStation.get(station);
        for (const sign of signs) {
            sign.reset();
        }

        const audios = this.audiosByStation.get(station);
        for (const audio of audios) {
            audio.reset();
        }

        const videos = this.videosByStation.get(station);
        for (const video of videos) {
            video.reset();
        }

        const texts = this.textsByStation.get(station);
        for (const text of texts) {
            text.reset();
        }
    }

    private readonly imgCache = new LRUCache<string, CanvasImageTypes[]>(10);
    private readonly imgTasks = new Map<string, Promise<CanvasImageTypes[]>>();

    evict(station: Station) {
        this.imgCache.delete(station.filePath);
        this.imgTasks.delete(station.filePath);
    }

    private async prefetchConnectedStation(connections: Map<Station, Connection>, toStation: Station): Promise<void> {
        const connection = connections.get(toStation);
        connection.enabled = false;
        if (!this.imgCache.has(toStation.filePath)) {
            await this.getImage(toStation.filePath, connection);
        }
        connection.enabled = true;
    }

    private getImage(path: string, prog: IProgress): Promise<CanvasImageTypes[]> {
        if (this.imgCache.has(path)) {
            return Promise.resolve(this.imgCache.get(path));
        }

        if (this.imgTasks.has(path)) {
            return this.imgTasks.get(path);
        }

        const task = this.getImages(path, prog)
            .then((images) => {
                this.imgCache.set(path, images);
                this.imgTasks.delete(path);
                return images;
            });

        this.imgTasks.set(path, task);
        return task;
    }

    private async getImages(path: string, prog: IProgress): Promise<CanvasImageTypes[]> {
        const { contentType } = await this.env.fetcher
            .head(path)
            .exec();
        if (contentType === Image_Vendor_Google_StreetView_Pano.value) {
            const pano = await this.env.fetcher
                .get(path)
                .text()
                .then(unwrapResponse);
            const images = await this.rig.loadImages(pano, PhotosphereCaptureResolution.High, prog);
            return images;
        }
        else {
            // TODO in the editor, evict any cached items
            const image = await this.env.fetcher
                .get(path)
                .useCache(!this.env.DEBUG)
                .image()
                .then(unwrapResponse);
            return [image];
        }
    }

    async isCached(path: string): Promise<boolean> {
        return await this.imgCache.has(path);
    }

    clearCache(): void {
        this.imgCache.clear();
    }

    getConnectedStations(fromStation: Station): ReadonlyArray<Station> {
        return fromStation && this.connections
            .filter(c => c.fromStationID === fromStation.transformID)
            .map(c => this.getStation(c.toStationID));
    }


    async playAudioZone(zone: string): Promise<void> {
        if (zone !== this.curZone) {
            const toPause = new Map<HTMLMediaElement, AudioElementSource>();
            const toPlay = new Map<HTMLMediaElement, AudioElementSource>();
            for (const clip of this.zonedClips.get(this.curZone)) {
                toPause.set(clip.audio, clip);
                clip.disable();
            }

            for (const clip of this.zonedClips.get(zone)) {
                if (toPause.has(clip.audio)) {
                    toPause.delete(clip.audio);
                }
                else {
                    toPlay.set(clip.audio, clip);
                }
                clip.enable();
            }

            for (const clip of toPause.values()) {
                clip.pause();
            }

            await Promise.all(Array.from(toPlay.values()).map(clip => clip.play()));

            this.curZone = zone;
        }
    }

    pauseCurrentAudioZone(): void {
        const clips = this.zonedClips.get(this.curZone);
        const toPause = new Map<HTMLMediaElement, AudioElementSource>();
        for (const clip of clips) {
            toPause.set(clip.audio, clip);
            clip.disable();
        }

        for (const clip of toPause.values()) {
            clip.pause();
        }
    }

    async playCurrentAudioZone(): Promise<void> {
        if (!this.environmentAudioMuted) {
            const clips = this.zonedClips.get(this.curZone);
            const toPlay = new Map<HTMLMediaElement, AudioElementSource>();
            for (const clip of clips) {
                clip.enable();
                toPlay.set(clip.audio, clip);
            }

            await Promise.all(Array.from(toPlay.values()).map(clip => clip.play()));
        }
    }


    log(key: string, value?: object): void {
        this.dataLogger.log(key, value);
    }

    error(page: string, operation: string, exception?: any): void {
        this.dataLogger.error(page, operation, exception);
    }
}
