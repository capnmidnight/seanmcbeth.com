import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { arrayRemove } from "@juniper-lib/collections/dist/arrays";
import { PriorityList } from "@juniper-lib/collections/dist/PriorityList";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/dist/EventBase";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/dist/using";
import { BaseScenarioFileAssetData, FileData, TransformData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Transform } from "../../../vr-apps/yarrow/Transform";
import { EditableScenario } from "../EditableScenario";
import { makeMarkerPath } from "../makeSphereName";
import { AssetUpdatedEvent, DeletableAsset } from "../models";

interface BaseScenarioFileAssetCreateOutputData {
    transform: TransformData
}

export class ScenarioAdapterTransformMovedEvent<T> extends TypedEvent<"transformmoved"> {
    constructor(public readonly object: T, public readonly transform: Transform) {
        super("transformmoved");
    }
}

interface BaseScenarioFileAssetAdapterEvents<T> {
    "transformmoved": ScenarioAdapterTransformMovedEvent<T>;
}

export abstract class BaseScenarioFileAssetAdapter<
    T extends BaseScenarioFileAssetData & IDisposable & { error: unknown },
    CreateInputT,
    CreateOutputT extends BaseScenarioFileAssetCreateOutputData>
    extends TypedEventBase<BaseScenarioFileAssetAdapterEvents<T>> {

    constructor(protected readonly scenario: EditableScenario,
        private readonly assets: T[],
        private readonly assetsByStation: PriorityList<Station, T>,
        private readonly assetName: string) {
        super();
    }

    abstract create(station: Station, file: FileData, progress?: IProgress): Promise<T>;

    protected abstract getMarkerImagePath(obj: T): string;
    protected abstract onMarkerSelected(obj: T, isContenxtMenu: boolean): void;

    protected saveTransformThrottled(obj: T, transform: Transform): void {
        this.scenario.transformAdapter.saveMatrixThrottled(transform);
        this.dispatchEvent(new ScenarioAdapterTransformMovedEvent(obj, transform));
    }

    protected async saveTransform(obj: T, transform: Transform): Promise<void> {
        await this.scenario.transformAdapter.saveMatrix(transform);
        this.dispatchEvent(new ScenarioAdapterTransformMovedEvent(obj, transform));
    }

    protected abstract createAsset(output: CreateOutputT, download: IProgress): Promise<T>;

    protected async createTransformAndSaveAsset(input: CreateInputT, upload: IProgress, download: IProgress): Promise<T> {
        const output = await this.scenario
            .postFor<CreateOutputT>("Create", this.assetName, input, upload)
            .then(unwrapResponse);

        const transform = this.scenario.addTransformData(output.transform);
        const parentTransform = this.scenario.getTransform(output.transform.parentTransformID);
        parentTransform.attach(transform);

        const obj = await this.createAsset(output, download);

        download.end();
        return obj;
    }

    async createEditorAssets(obj: T) {
        if (!this.scenario.fileMarkers.has(obj.transformID)) {
            const transform = this.scenario.getTransform(obj.transformID);
            const prefix = isDefined(obj.error)
                ? "error-"
                : "";
            const marker = await this.scenario.createMarker(
                obj,
                obj.transformID,
                obj.fileName,
                makeMarkerPath(prefix + this.getMarkerImagePath(obj)));

            if (isDefined(marker)) {

                marker.addListener("click", () =>
                    this.onMarkerSelected(obj, false));

                marker.addListener("contextmenu", () =>
                    this.onMarkerSelected(obj, true));

                if (!this.scenario.published) {
                    marker.setDraggable(true);
                    marker.setCursor("move");

                    marker.addListener("dragend", (evt: google.maps.MapMouseEvent) => {
                        const curLL = this.scenario.getTransformPosition(obj.transformID);
                        this.moveTransformThrottled(
                            obj,
                            transform,
                            evt.latLng.lat(),
                            evt.latLng.lng(),
                            curLL.alt);
                        this.scenario.dispatchEvent(new AssetUpdatedEvent(obj as unknown as DeletableAsset));
                    });
                }
            }
        }
    }

    private onTransformMoved(obj: T, transform: Transform) {
        this.scenario.transformAdapter.updateMarker(transform, obj);
        this.scenario.dispatchEvent(new AssetUpdatedEvent(obj as any as DeletableAsset));
        this.dispatchEvent(new ScenarioAdapterTransformMovedEvent(obj, transform));
    }

    protected moveTransformThrottled(obj: T, transform: Transform, latitude: number, longitude: number, altitude: number): void {
        this.scenario.moveTransformByGeoThrottled(transform, latitude, longitude, altitude);
        this.onTransformMoved(obj, transform);
    }

    protected async moveTransform(obj: T, transform: Transform, latitude: number, longitude: number, altitude: number): Promise<void> {
        await this.scenario.moveTransformByGeo(transform, latitude, longitude, altitude);
        this.onTransformMoved(obj, transform);
    }

    resetThrottled(obj: T, defaultAvatarHeight: number): void {
        const transform = this.scenario.getTransform(obj.transformID);
        transform.position.set(0, defaultAvatarHeight, -2);
        transform.quaternion.identity();
        this.saveTransformThrottled(obj, transform);
        this.scenario.transformAdapter.updateMarker(transform, obj);
    }

    async reset(obj: T, defaultAvatarHeight: number): Promise<void> {
        const transform = this.scenario.getTransform(obj.transformID);
        transform.position.set(0, defaultAvatarHeight, -2);
        transform.quaternion.identity();
        await this.saveTransform(obj, transform);
        this.scenario.transformAdapter.updateMarker(transform, obj);
    }

    async delete(obj: T): Promise<void> {
        const marker = this.scenario.fileMarkers.get(obj.transformID);
        const transform = this.scenario.getTransform(obj.transformID);
        const station = transform && this.scenario.findStation(transform);

        await this.scenario.post("Delete", this.assetName, obj.key);

        arrayRemove(this.assets, obj);

        this.assetsByStation.remove(station, obj);

        if (isDefined(transform)) {
            await this.scenario.removeTransform(transform);
        }

        if (isDefined(marker)) {
            marker.setMap(null);
            this.scenario.fileMarkers.delete(obj.transformID);
        }

        obj.dispose();
    }
}
