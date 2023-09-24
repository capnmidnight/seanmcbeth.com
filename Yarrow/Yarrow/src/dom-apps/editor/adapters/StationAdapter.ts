import { star } from "@juniper-lib/emoji/dist";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { g2y } from "@juniper-lib/google/dist-maps/conversion";
import { arrayRemove } from "@juniper-lib/collections/dist/arrays";
import { coallesce } from "@juniper-lib/collections/dist/coallesce";
import { TypedEvent } from "@juniper-lib/events/dist/EventBase";
import { ILatLngPoint, LatLngPoint } from "@juniper-lib/gis/dist/LatLngPoint";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplit } from "@juniper-lib/progress/dist/progressSplit";
import { isDefined, isNullOrUndefined, isString } from "@juniper-lib/tslib/dist/typeChecks";
import { Matrix4 } from "three";
import type { BaseScenarioFileAssetData, DeleteOp, StationData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Transform } from "../../../vr-apps/yarrow/Transform";
import type { EditableScenario } from "../EditableScenario";
import { makeMarkerPath } from "../makeSphereName";
import { AssetSelectedEvent, AssetUpdatedEvent } from "../models";

function getMarkerLabelString(oldMarker: google.maps.Marker): string {
    let text: string = null;
    const label = oldMarker.getLabel() as (string | google.maps.MarkerLabel);
    if (isString(label)) {
        text = label;
    }
    else {
        text = label.text;
    }

    return text;
}

interface StationCreateInput {
    fileID: number,
    transformID: number,
    rotation: number[],
    latitude: number,
    longitude: number,
    altitude: number
}

export interface StationUpdateInput {
    fileName: string;
    stationID: number;
    latitude: number;
    longitude: number;
    altitude: number;
    zone: string;
    label: string;
    rotation: number[];
}


export class StationAdapter {
    constructor(private readonly scenario: EditableScenario) {
    }

    async create(fileID: number, fileName: string, latitude: number, longitude: number, altitude: number, prog?: IProgress): Promise<Station> {
        const stationLatLng = new LatLngPoint(latitude, longitude, altitude);
        await this.scenario.resolveOrigin(stationLatLng);

        const stationVector = this.scenario.latLngToVector(stationLatLng);
        const stationTranslation = new Matrix4().makeTranslation(stationVector.x, stationVector.y, stationVector.z);

        const transformData = await this.scenario.transformAdapter.create(this.scenario.rootTransform.transformID, fileName, stationTranslation.toArray());

        const transform = this.scenario.addTransformData(transformData);
        this.scenario.rootTransform.attach(transform);

        const input: StationCreateInput = {
            transformID: transform.transformID,
            fileID,
            rotation: [0, 0, 0, 1],
            latitude,
            longitude,
            altitude
        };

        const [upload, download] = progressSplit(prog, 2);
        const data = await this.scenario
            .postFor<StationData>("Add", "Stations", input, upload)
            .then(unwrapResponse);

        const station = await this.scenario.createStation(data, download);

        if (isNullOrUndefined(this.scenario.startStationID)) {
            this.scenario.startStationID = station.transformID;
        }

        this.scenario.stations.push(station);

        return station;
    }

    async markStart(station: Station): Promise<void> {
        let startStation = this.scenario.startStation;
        const oldMarker = startStation
            && this.scenario.fileMarkers.get(startStation.transformID);

        await this.scenario.post("MarkStart", "Stations", station.transformID);

        this.scenario.startStationID = station.transformID;
        startStation = this.scenario.startStation;
        const newMarker = startStation
            && this.scenario.fileMarkers.get(this.scenario.startStation.transformID);

        if (isDefined(oldMarker)) {
            let newLabel = getMarkerLabelString(oldMarker);
            newLabel = newLabel.substring(star.emojiStyle.length);
            oldMarker.setLabel(newLabel);
        }

        if (isDefined(newMarker)) {
            let newLabel = getMarkerLabelString(newMarker);
            newLabel = star.emojiStyle + newLabel;
            newMarker.setLabel(newLabel);
        }
    }

    setStartRotation(station: Station, rotation: number): void {
        if (this.scenario.startStation === station) {
            this.scenario.startRotation = rotation;
            this.scenario.throttle(`updateScenarioStartRotation::${this.scenario.id}`, () =>
                this.scenario.post("SetStartRotation", "Stations", rotation));
        }
    }

    async createEditorAssets(station: Station) {
        await this.createMarker(station);
    }

    async createMarker(station: Station): Promise<void> {
        let marker = this.scenario.fileMarkers.get(station.transformID);
        if (marker) {
            marker.setMap(null);
        }

        let label = station.fileName;
        if (station.transformID === this.scenario.startStationID) {
            label = star.emojiStyle + label;
        }

        marker = await this.scenario.createMarker(station, station.transformID, label, makeMarkerPath(stationIcon));

        if (isDefined(marker)) {
            marker.addListener("click", () =>
                this.onMarkerSelected(station, false));

            marker.addListener("contextmenu", () =>
                this.onMarkerSelected(station, true));

            if (!this.scenario.published) {
                marker.setDraggable(true);
                marker.setCursor("move");
                
                marker.addListener("drag", (evt: google.maps.MapMouseEvent) => {
                    for (const [fromStationID, toStationID, line] of this.scenario.lines.entries()) {
                        if (fromStationID === station.transformID
                            || toStationID === station.transformID) {
                            const path = line.getPath();
                            const idx = fromStationID === station.transformID ? 0 : 1;

                            path.setAt(idx, evt.latLng);
                        }
                    }
                });

                marker.addListener("dragend", async (evt: google.maps.MapMouseEvent) => {
                    this.scenario.dispatchEvent(new EditableScenarioStationMarkerMovedEvent(station, g2y(evt.latLng)));
                    this.scenario.dispatchEvent(new AssetUpdatedEvent(station));
                });
            }
        }
    }

    private onMarkerSelected(station: Station, isContextMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioStationSelectedEvent(station));
        this.scenario.dispatchEvent(new AssetSelectedEvent(station, isContextMenu));
    }

    moveThrottled(station: Station, latitude: number, longitude: number, altitude: number, resetRotation: boolean): void {
        const transform = this.setMoveData(resetRotation, station, latitude, longitude, altitude);
        this.scenario.moveTransformByGeoThrottled(transform, latitude, longitude, altitude);
        this.getMoveData(station, transform);
    }

    async move(station: Station, latitude: number, longitude: number, altitude: number, resetRotation: boolean): Promise<void> {
        const transform = this.setMoveData(resetRotation, station, latitude, longitude, altitude);
        await this.scenario.moveTransformByGeo(transform, latitude, longitude, altitude);
        this.getMoveData(station, transform);
    }

    private getMoveData(station: Station, transform: Transform) {
        if (station.transformID === this.scenario.curStationID) {
            transform.getWorldPosition(this.scenario.env.stage.position);
        }
    }

    private setMoveData(resetRotation: boolean, station: Station, latitude: number, longitude: number, altitude: number) {
        if (resetRotation) {
            this.updateThrottled(station, {
                latitude,
                longitude,
                altitude,
                rotation: [0, 0, 0, 1]
            });
        }
        else {
            this.updateThrottled(station, {
                latitude,
                longitude,
                altitude
            });
        }

        const transform = this.scenario.getTransform(station.transformID);
        return transform;
    }

    updateThrottled(station: Station, newData: Partial<StationUpdateInput>): void {
        this.setUpdateData(newData, station);
        this.scenario.throttle(`updateStation::${station.transformID}`, () =>
            this.scenario.post("Update", "Stations", newData));
        this.getUpdateData(station, newData);
    }

    async update(station: Station, newData: Partial<StationUpdateInput>): Promise<void> {
        this.setUpdateData(newData, station);
        await this.scenario.post("Update", "Stations", newData);
        this.getUpdateData(station, newData);
    }

    private copy(overwrite: boolean, to: Partial<StationUpdateInput>, from: Partial<StationUpdateInput>): void {
        coallesce(overwrite, to, from,
            "fileName",
            "zone",
            "rotation",
            "label"
        );
    }

    private setUpdateData(newData: Partial<StationUpdateInput>, station: Station) {
        newData.stationID = station.key;
        this.copy(false, newData, station);

        if (!("latitude" in newData)) {
            newData.latitude = station.location.lat;
        }
        if (!("longitude" in newData)) {
            newData.longitude = station.location.lng;
        }
        if (!("altitude" in newData)) {
            newData.altitude = station.location.alt;
        }
    }

    private getUpdateData(station: Station, newData: Partial<StationUpdateInput>) {
        this.copy(true, station, newData);

        station.location.lat = newData.latitude;
        station.location.lng = newData.longitude;
        station.location.alt = newData.altitude;

        const marker = this.scenario.fileMarkers.get(station.transformID);
        marker.setLabel(newData.fileName);

        this.scenario.refreshZones();
        this.scenario.env.skybox.rotation = station.rotation;
        if (this.scenario.curStation === station) {
            this.scenario.env.infoLabel.image.value = station.label || station.fileName;
        }
    }

    async delete(station: Station): Promise<void> {
        const transform = this.scenario.getTransform(station.transformID);
        const marker = this.scenario.fileMarkers.get(station.transformID);
        const connections = this.scenario.connections.filter(c => c.fromStationID === station.transformID
            || c.toStationID === station.transformID);

        const oldStartID = this.scenario.startStationID;
        this.scenario.startStationID = await this.scenario
            .postFor<number>("Delete", "Stations", station.transformID)
            .then(unwrapResponse);
        if (this.scenario.startStationID !== oldStartID
            && this.scenario.startStationID) {
            const startStation = this.scenario.startStation;
            const startMarker = this.scenario.fileMarkers.get(startStation.transformID);
            if (isDefined(startMarker)) {
                startMarker.setLabel(star.emojiStyle + startStation.fileName);
            }
        }

        if (station.transformID === this.scenario.curStationID) {
            this.scenario.curStationID = null;
        }

        for (const connection of connections) {
            const fromStation = this.scenario.getStation(connection.fromStationID);
            const toStation = this.scenario.getStation(connection.toStationID);
            await this.scenario.connectionAdapter.disconnect(fromStation, toStation);
        }

        marker.setMap(null);
        this.scenario.fileMarkers.delete(station.transformID);

        arrayRemove(this.scenario.stations, station);

        await this.scenario.removeTransform(transform);
    }
}

const stationIcon = "globe";

export class EditableScenarioStationSelectedEvent extends TypedEvent<"stationselected"> {
    constructor(public station: Station) {
        super("stationselected");
    }
}

export class EditableScenarioStationMarkerMovedEvent extends TypedEvent<"stationmarkermoved"> {
    constructor(public readonly station: Station, public readonly latLng: ILatLngPoint) {
        super("stationmarkermoved");
    }
}

export class EditableScenarioItemsDeletedEvent extends TypedEvent<"itemsdeleted"> {
    constructor(public readonly items: DeleteOp) {
        super("itemsdeleted");
    }
}

export class EditableScenarioMarkerSelectedEvent<K extends string, T extends BaseScenarioFileAssetData> extends TypedEvent<`${K}selected`> {
    constructor(public readonly subType: K, public readonly object: T) {
        super(`${subType}selected`);
    }
}