import { cleanup } from "@juniper-lib/threejs/dist/cleanup";
import { arrayRemove } from "@juniper-lib/collections/dist/arrays";
import { all } from "@juniper-lib/events/dist/all";
import { StationConnectionData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { EditableScenario } from "../EditableScenario";

interface ConnectionInput {
    fromStationID: number;
    toStationID: number;
}

interface ConnectionUpdateInput extends ConnectionInput {
    transformID: number;
    label: string;
}

export class ConnectionAdapter {
    constructor(private readonly scenario: EditableScenario) {
    }

    async createEditorAssets(connection: StationConnectionData) {

        if (connection.transformID < 0) {
            const transform = this.scenario.getTransform(connection.transformID);

            const oldData = transform.data;
            const newData = await this.scenario.transformAdapter.create(oldData.parentTransformID, oldData.name, oldData.matrix);

            this.scenario.transformsByTransformID.delete(oldData.id);

            this.scenario.transformsByTransformID.set(newData.id, transform);
            connection.transformID = newData.id;
            transform.data.id = newData.id;

            await this.update(connection, connection.label);
            await this.reset(connection);
        }

        const fromStation = this.scenario.getStation(connection.fromStationID);
        const toStation = this.scenario.getStation(connection.toStationID);
        const path = [fromStation, toStation].map(s => s.location);
        const line = this.scenario.createLine(path);

        this.scenario.lines.add(fromStation.transformID, toStation.transformID, line);
    }

    getConnectableStations(fromStation: Station): ReadonlyArray<Station> {
        const connectedTo = fromStation && this.scenario.connections
            .filter(c => c.fromStationID === fromStation.transformID)
            .map(c => c.toStationID);

        return fromStation && this.scenario.stations
            .filter(s => s.transformID !== fromStation.transformID
                && connectedTo.indexOf(s.transformID) === -1);
    }

    findConnection(fromStation: Station, toStation: Station): StationConnectionData {
        for (const connection of this.scenario.connections) {
            if (connection.fromStationID == fromStation.transformID
                && connection.toStationID == toStation.transformID) {
                return connection;
            }
        }

        return null;
    }

    async create(fromStation: Station, toStation: Station): Promise<void> {
        const forward: StationConnectionData = {
            fromStationID: fromStation.transformID,
            toStationID: toStation.transformID
        };

        const back: StationConnectionData = {
            fromStationID: toStation.transformID,
            toStationID: fromStation.transformID
        };

        await all(
            this.createConnectionHalf(forward),
            this.createConnectionHalf(back)
        );
    }

    private async createConnectionHalf(connection: StationConnectionData): Promise<void> {
        await this.scenario.post("Create", "Connections", connection)
        const icon = await this.scenario.createConnection(connection);
        this.scenario.connections.push(connection);
        await this.scenario.transformAdapter.saveMatrix(icon.transform);
    }

    async reset(connection: StationConnectionData): Promise<void> {
        const fromStation = this.scenario.getStation(connection.fromStationID);
        const toStation = this.scenario.getStation(connection.toStationID);
        const connections = this.scenario.curConnections.get(fromStation);
        const icon = connections.get(toStation);
        icon.resetPosition();
        await this.scenario.transformAdapter.saveMatrix(icon.transform);
    }

    updateThrottled(connection: StationConnectionData, label: string): void {
        const newData = this.setConnectionUpdateData(connection, label);
        this.scenario.throttle(`updateConnectionLabel::${connection.fromStationID} -> ${connection.toStationID}`, () =>
            this.scenario.post("Update", "Connections", newData));
    }

    async update(connection: StationConnectionData, label: string): Promise<void> {
        const newData = this.setConnectionUpdateData(connection, label);
        await this.scenario.post("Update", "Connections", newData);
    }

    private setConnectionUpdateData(connection: StationConnectionData, label: string): ConnectionUpdateInput {
        connection.label = label;
        const fromStation = this.scenario.getStation(connection.fromStationID);
        const connections = this.scenario.curConnections.get(fromStation);
        if (connections) {
            const toStation = this.scenario.getStation(connection.toStationID);
            const icon = connections.get(toStation);
            icon.label = label;
        }

        return {
            transformID: connection.transformID,
            fromStationID: connection.fromStationID,
            toStationID: connection.toStationID,
            label
        };
    }

    async disconnect(fromStation: Station, toStation: Station): Promise<void> {
        await all(
            this.scenario.post("Delete", "Connections", {
                fromStationID: fromStation.transformID,
                toStationID: toStation.transformID
            }),
            this.removeConnection(fromStation, toStation),
            this.removeConnection(toStation, fromStation)
        );
    }

    private async removeConnection(fromStation: Station, toStation: Station): Promise<void> {
        const connection = this.findConnection(fromStation, toStation);
        arrayRemove(this.scenario.connections, connection);

        const line = this.scenario.lines.get(fromStation.transformID, toStation.transformID);
        if (line) {
            line.setMap(null);
            this.scenario.lines.delete(toStation.transformID, toStation.transformID);
        }

        const icon = this.scenario.curConnections.get(fromStation, toStation);
        if (icon) {
            await this.scenario.removeTransform(icon.transform);
            this.scenario.curConnections.delete(fromStation, toStation);
            cleanup(icon);
        }
    }
}