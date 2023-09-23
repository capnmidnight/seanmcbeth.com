import type { IResponse } from "@juniper-lib/fetcher/IResponse";
import { g2y } from "@juniper-lib/google-maps/conversion";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes";
import { cleanup } from "@juniper-lib/threejs/cleanup";
import type { Environment } from "@juniper-lib/threejs/environment/Environment";
import { objectSetWorldPosition } from "@juniper-lib/threejs/objects";
import { arrayReplace, arraySortedInsert } from "@juniper-lib/collections/arrays";
import { PriorityMap } from "@juniper-lib/collections/PriorityMap";
import { TypedEvent } from "@juniper-lib/events/EventBase";
import { ILatLngPoint, LatLngPoint } from "@juniper-lib/gis/LatLngPoint";
import { UTMPoint } from "@juniper-lib/gis/UTMPoint";
import { IDataLogger } from "@juniper-lib/tslib/IDataLogger";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { vec3 } from "gl-matrix";
import { Vector3 } from "three";
import type { Audio } from "../../vr-apps/yarrow/Audio";
import { BaseScenario } from "../../vr-apps/yarrow/BaseScenario";
import { Connection } from "../../vr-apps/yarrow/Connection";
import { AudioTrackData, BaseFileAssetData, FullScenarioData, isGeographicData, isScenarioFileAssetData, ModelData, ScenarioVersionData, SignData, StationConnectionData, StationData, TextData, VideoClipData } from "../../vr-apps/yarrow/data";
import type { Model } from "../../vr-apps/yarrow/Model";
import type { Sign } from "../../vr-apps/yarrow/Sign";
import type { Station } from "../../vr-apps/yarrow/Station";
import type { Text } from "../../vr-apps/yarrow/Text";
import { Transform } from "../../vr-apps/yarrow/Transform";
import type { Video } from "../../vr-apps/yarrow/Video";
import { AudiosAdapter, EditableScenarioAudioSelectedEvent } from "./adapters/AudiosAdapter";
import { ConnectionAdapter } from "./adapters/ConnectionAdapter";
import { EditableScenarioModelSelectedEvent, ModelsAdapter } from "./adapters/ModelsAdapter";
import { EditableScenarioSignSelectedEvent, SignsAdapter } from "./adapters/SignsAdapter";
import { EditableScenarioStationMarkerMovedEvent, EditableScenarioStationSelectedEvent, StationAdapter } from "./adapters/StationAdapter";
import { EditableScenarioTextSelectedEvent, TextsAdapter } from "./adapters/TextsAdapter";
import { TransformAdapter } from "./adapters/TransformAdapter";
import { EditableScenarioVideoSelectedEvent, VideosAdapter } from "./adapters/VideosAdapter";
import { EditableScenarioObjectMovedEvent } from "./EditableScenarioObjectMovedEvent";
import { AssetSelectedEvent, AssetUpdatedEvent, ResetableAsset } from "./models";
import { Throttler } from "./Throttler";
import type { IMapView } from "./views/MapView";

interface EditableScenarioEvents {
    assetselected: AssetSelectedEvent;
    assetupdated: AssetUpdatedEvent;
    stationselected: EditableScenarioStationSelectedEvent;
    stationmarkermoved: EditableScenarioStationMarkerMovedEvent;
    audioselected: EditableScenarioAudioSelectedEvent;
    signselected: EditableScenarioSignSelectedEvent;
    videoselected: EditableScenarioVideoSelectedEvent;
    textselected: EditableScenarioTextSelectedEvent;
    modelselected: EditableScenarioModelSelectedEvent;
    objectmoved: EditableScenarioObjectMovedEvent;
    zonesupdated: TypedEvent<"zonesupdated">;
}

export class EditableScenario
    extends BaseScenario<EditableScenarioEvents> {

    private readonly throttlers = new Map<string, Throttler>();

    readonly versions: ScenarioVersionData[];

    readonly fileMarkers = new Map<number, google.maps.Marker>();

    readonly lines = new PriorityMap<number, number, google.maps.Polyline>();
    readonly zones = new Array<string>();

    readonly transformAdapter = new TransformAdapter(this);
    readonly stationAdapter = new StationAdapter(this);
    readonly connectionAdapter = new ConnectionAdapter(this);
    readonly signAdapter = new SignsAdapter(this);
    readonly audioAdapter = new AudiosAdapter(this);
    readonly videoAdapter = new VideosAdapter(this);
    readonly textAdapter = new TextsAdapter(this);
    readonly modelAdapter = new ModelsAdapter(this);

    constructor(
        env: Environment,
        data: FullScenarioData,
        dataLogger: IDataLogger,
        private readonly map: IMapView) {
        super(env, dataLogger, data);
        this.versions = data.versions;
    }

    override dispose() {
        for (const marker of this.fileMarkers.values()) {
            marker.setMap(null);
        }
        this.fileMarkers.clear();

        for (const line of this.lines.values()) {
            line.setMap(null);
        }
        this.lines.clear();

        super.dispose();
    }

    throttle(key: string, callback: () => Promise<unknown>): void {
        if (!this.throttlers.has(key)) {
            this.throttlers.set(key, new Throttler());
        }

        const throttler = this.throttlers.get(key);
        throttler.throttle(callback);
    }

    refreshZones(): void {
        const newZones = new Array<string>();
        for (const station of this.stations) {
            if (isDefined(station.zone)) {
                arraySortedInsert(newZones, station.zone, false);
            }
        }

        for (const audio of this.audios) {
            if (isDefined(audio.zone)) {
                arraySortedInsert(newZones, audio.zone, false);
            }
        }

        const changed = newZones.length !== this.zones.length
            || !newZones.every((zone, idx) => zone === this.zones[idx]);

        arrayReplace(this.zones, ...newZones);

        if (changed) {
            this.dispatchEvent(new TypedEvent("zonesupdated"));
        }
    }

    override async loadAssets(assetProg?: IProgress) {
        await super.loadAssets(assetProg);
        this.refreshZones();
    }

    toggleMarkers() {
        for (const marker of this.fileMarkers.values()) {
            marker.setVisible(!marker.getVisible());
        }
    }

    makeOnlyStationsSelectable(stations: readonly Station[]) {
        const keys = stations.map(s => s.key);
        for (const [key, marker] of this.fileMarkers.entries()) {
            const enabled = keys.indexOf(key) > -1;
            marker.setOpacity(enabled ? 1 : 0.5);
            marker.setClickable(enabled);
        }
    }

    makeAllMarkersSelectable() {
        for (const marker of this.fileMarkers.values()) {
            marker.setOpacity(1);
            marker.setClickable(true);
        }
    }

    override async createStation(station: StationData, prog?: IProgress): Promise<Station> {
        const stat = await super.createStation(station, prog);
        this.cancellationToken.check();
        if (isDefined(stat)) {
            await this.stationAdapter.createEditorAssets(stat);
            this.cancellationToken.check();
        }
        return stat;
    }

    override async createConnection(connection: StationConnectionData): Promise<Connection> {
        const icon = super.createConnection(connection);
        if (isDefined(icon)) {
            await this.connectionAdapter.createEditorAssets(connection);
            this.cancellationToken.check();
        }
        return icon;
    }

    override async createAudio(audioTrack: AudioTrackData, prog?: IProgress): Promise<Audio> {
        const audio = await super.createAudio(audioTrack, prog);
        this.cancellationToken.check();
        if (isDefined(audio)) {
            await this.audioAdapter.createEditorAssets(audio);
            this.cancellationToken.check();
        }

        return audio;
    }

    override async createSign(sign: SignData, prog?: IProgress): Promise<Sign> {
        const img = await super.createSign(sign, prog);
        this.cancellationToken.check();
        if (isDefined(img)) {
            await this.signAdapter.createEditorAssets(img);
            this.cancellationToken.check();
        }

        return img;
    }

    override async createVideo(videoClip: VideoClipData, prog?: IProgress): Promise<Video> {
        const video = await super.createVideo(videoClip, prog);
        this.cancellationToken.check();
        if (isDefined(video)) {
            await this.videoAdapter.createEditorAssets(video);
            this.cancellationToken.check();
        }

        return video;
    }

    override async createText(text: TextData, prog?: IProgress): Promise<Text> {
        const txt = await super.createText(text, prog);
        this.cancellationToken.check();
        if (isDefined(txt)) {
            await this.textAdapter.createEditorAssets(txt);
            this.cancellationToken.check();
        }

        return txt;
    }

    override async createModel(model: ModelData, prog?: IProgress): Promise<Model> {
        const mod = await super.createModel(model, prog);
        this.cancellationToken.check();
        if (isDefined(mod)) {
            await this.modelAdapter.createEditorAssets(mod);
            this.cancellationToken.check();
        }

        return mod;
    }

    private makePost<T>(command: string, resource: string, object: T, prog?: IProgress) {
        return this.env.fetcher
            .post(`/Editor/Scenarios/${resource}/${this.id}`)
            .query("handler", command)
            .body(object, Application_JsonUTF8)
            .progress(prog);
    }

    postFor<T, V = unknown>(command: string, resource: string, object?: V, prog?: IProgress): Promise<IResponse<T>> {
        return this.makePost(command, resource, object, prog).object<T>();
    }

    post<T>(command: string, resource: string, object?: T, prog?: IProgress): Promise<IResponse> {
        return this.makePost(command, resource, object, prog).exec();
    }

    async publish(): Promise<void> {
        await this.post("Publish", "Layout");
        this.data.published = true;
    }

    fork(): Promise<IResponse<number>> {
        return this.postFor<number>("Fork", "Layout");
    }

    async resolveOrigin(point: ILatLngPoint): Promise<void> {
        if (isNullOrUndefined(this._originLL)) {
            await this.setOrigin(point);
        }
    }

    private async setOrigin(point: ILatLngPoint): Promise<void> {
        if (isNullOrUndefined(point)) {
            this._originLL = null;
            await this.post("SetOrigin", "Layout", null);
        }
        else {
            this._originLL = new LatLngPoint(point);
            await this.post("SetOrigin", "Layout", {
                lat: this._originLL.lat,
                lng: this._originLL.lng,
                alt: this._originLL.alt
            });
        }
    }

    vectorToLatLng(objVector: Vector3): LatLngPoint {
        const rootUTMVec = this.originUTM.toVec3();
        const objVec = vec3.fromValues(objVector.x, objVector.y, objVector.z);
        const objUTMVec = vec3.add(vec3.create(), rootUTMVec, objVec);
        const objUTM = new UTMPoint().fromVec3(objUTMVec, this.originUTM.zone);
        const objLL = objUTM.toLatLng();
        return objLL;
    }

    latLngToVector(objLL: LatLngPoint): Vector3 {
        const rootUTMVec = this.originUTM.toVec3();
        const objUTM = objLL
            .toUTM()
            .rezone(this.originUTM.zone);
        const objUTMVec = objUTM.toVec3();
        const objVec = vec3.sub(vec3.create(), objUTMVec, rootUTMVec);
        const objVector = new Vector3().fromArray(objVec);
        return objVector;
    }

    moveTransformByGeoThrottled(transform: Transform, latitude: number, longitude: number, altitude: number): void {
        this.setMoveTransforByGeoData(latitude, longitude, altitude, transform);
        this.transformAdapter.saveMatrixThrottled(transform);
    }

    async moveTransformByGeo(transform: Transform, latitude: number, longitude: number, altitude: number): Promise<void> {
        this.setMoveTransforByGeoData(latitude, longitude, altitude, transform);
        await this.transformAdapter.saveMatrix(transform);
    }

    private setMoveTransforByGeoData(latitude: number, longitude: number, altitude: number, transform: Transform) {
        const nextLL = new LatLngPoint(latitude, longitude, altitude);
        const nextVector = this.latLngToVector(nextLL);
        objectSetWorldPosition(transform, nextVector);
    }

    async createMarker<T extends BaseFileAssetData>(data: T, key: number, label: string, icon: string | URL): Promise<google.maps.Marker> {
        if (isNullOrUndefined(this.map)) {
            return null;
        }

        let location: ILatLngPoint = null;

        if (isGeographicData(data)) {
            location = data.location;
        }
        else if (isScenarioFileAssetData(data)) {
            location = this.getTransformPosition(data.transformID);
        }

        const marker = await this.map.createMarker(location, label, icon);
        marker.addListener("click", () =>
            this.map.setTarget(g2y(marker.getPosition())));

        this.fileMarkers.set(key, marker);
        return marker;
    }

    createLine(path: readonly ILatLngPoint[]): google.maps.Polyline {
        if (isNullOrUndefined(this.map)) {
            return null;
        }

        return this.map.createLine(path);
    }

    getTransformPosition(transformID: number): LatLngPoint {
        const transform = this.getTransform(transformID);
        if (isNullOrUndefined(transform)) {
            throw new Error("Couldn't find transform");
        }

        const objVector = transform.getWorldPosition(new Vector3());
        const objLatLng = this.vectorToLatLng(objVector);
        return objLatLng;
    }

    private findAssetForTransform(transformID: number, arr: ResetableAsset[]): ResetableAsset {
        for (const asset of arr) {
            if (asset.transformID === transformID) {
                return asset;
            }
        }

        return null;
    }

    getAssetForTransform(transform: Transform): ResetableAsset {
        return this.findAssetForTransform(transform.transformID, this.stations)
            || this.findAssetForTransform(transform.transformID, this.audios)
            || this.findAssetForTransform(transform.transformID, this.videos)
            || this.findAssetForTransform(transform.transformID, this.texts)
            || this.findAssetForTransform(transform.transformID, this.signs)
            || this.findAssetForTransform(transform.transformID, this.models)
            || this.findAssetForTransform(transform.transformID, this.connections);
    }

    async removeTransform(transform: Transform) {
        transform.parent.remove(transform);
        cleanup(transform);
        const toDelete = new Array<Transform>(transform);
        transform.traverse(child => {
            if (child instanceof Transform) {
                toDelete.push(child);
            }
        });

        for (const t of toDelete) {
            const id = t.transformID;
            this.transformsByTransformID.delete(id);
            const station = this.getStation(id);
            if (station) {
                this.signsByStation.delete(station);
                this.modelsByStation.delete(station);
                this.audiosByStation.delete(station);
                this.videosByStation.delete(station);
                this.textsByStation.delete(station);
                this.curConnections.delete(station);

                const moreToDelete = new Array<Station>();
                for (const [fromStation, toStation] of this.curConnections.entries()) {
                    if (toStation === station) {
                        moreToDelete.push(fromStation);
                    }
                }

                for (const fromStation of moreToDelete) {
                    this.curConnections.delete(fromStation, station);
                }
            }
        }

        if (isDefined(this.originLL)
            && this.isEmpty) {
            await this.setOrigin(null);
        }
    }

    override async showStation(station: Station, playTransitionSound: boolean, prog?: IProgress): Promise<void> {
        await super.showStation(station, playTransitionSound, prog);
        this.dispatchEvent(new AssetSelectedEvent(station, false));
    }

    async showStationNow(station: Station): Promise<void> {
        this.visible = true;
        if (this.curStation !== station) {
            await this.showStation(station, false);
            this.dispatchEvent(new EditableScenarioStationSelectedEvent(station));
        }
    }

    override log(): void {
        // don't log normal messages in the editor
    }
}
