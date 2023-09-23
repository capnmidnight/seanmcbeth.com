import { columnGap, px } from "@juniper-lib/dom/css";
import { onClick } from "@juniper-lib/dom/evts";
import { ButtonSecondarySmall, elementSetText, Run } from "@juniper-lib/dom/tags";
import { TypedEvent } from "@juniper-lib/events/EventBase";
import { Task } from "@juniper-lib/events/Task";
import { isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { GroupPanel } from "@juniper-lib/widgets/GroupPanel";
import type { StationConnectionData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { AssetDeleteEvent, AssetResetEvent, AssetSelectedEvent } from "../models";
import { BaseScenarioResetableObjectView } from "./BaseScenarioResetableObjectView";

export class ConnectionStartedEvent extends TypedEvent<"connectionstarted"> {
    constructor(public readonly connectables: readonly Station[]) {
        super("connectionstarted");
    }
}

interface StationConnectionsViewEvents {
    assetreset: AssetResetEvent<StationConnectionData>;
    assetdelete: AssetDeleteEvent<StationConnectionData>;
    assetselected: AssetSelectedEvent<Station>;
    connectionstarted: ConnectionStartedEvent;
    connectionending: TypedEvent<"connectionending">;
}

export class ConnectionsView
    extends BaseScenarioResetableObjectView<StationConnectionsViewEvents, StationConnectionData, Station> {

    private readonly toStationSelection = new Task<Station>(false);
    private readonly toStationName: HTMLSpanElement;
    private readonly selectStationButton: HTMLButtonElement;

    private fromStation: Station = null;
    private toStation: Station = null;

    constructor() {
        super("Connection", "Reset Connection");

        this.addProperties(
            ["To Station",
                new GroupPanel(
                    columnGap(px(5)),
                    this.toStationName = Run(),
                    this.selectStationButton = ButtonSecondarySmall(
                        "Select",
                        onClick(() => this.dispatchEvent(new AssetSelectedEvent(this.toStation, false)))
                    )
                )
            ]
        );

        document.addEventListener("keydown", (evt) => {
            if (evt.key === "Escape") {
                this.cancelConnection();
            }
        });

        Object.seal(this);

        this.refreshValues();
    }

    protected getValueName(value: StationConnectionData) {
        return value.label || "";
    }

    renameValue(value: StationConnectionData, newName: string): void {
        this.scenario.connectionAdapter.updateThrottled(value, newName);
    }

    async resetValue(value: StationConnectionData) {
        await this.scenario.connectionAdapter.reset(value);
    }

    get isConnecting() {
        return this.toStationSelection.running;
    }

    connectTo(toStation: Station) {
        if (this.isConnecting) {
            this.toStationSelection.resolve(toStation);
        }
    }

    cancelConnection() {
        if (this.isConnecting) {
            this.toStationSelection.resolve(null);
        }
    }

    async createValue(fromStation: Station): Promise<StationConnectionData> {
        this.toStationSelection.restart();

        const connectables = this.scenario.connectionAdapter.getConnectableStations(fromStation);
        this.dispatchEvent(new ConnectionStartedEvent(connectables));

        const toStation = await this.toStationSelection;
        this.dispatchEvent(new TypedEvent("connectionending"));

        if (isNullOrUndefined(toStation)) {
            console.warn("Station connection selection cancelled");
            return null;
        }

        if (connectables.indexOf(toStation) === -1) {
            console.warn(`Invalid connection: "${fromStation.fileName}" -> "${toStation.fileName}"`);
            return null;
        }

        await this.scenario.connectionAdapter.create(fromStation, toStation);
        return this.scenario.connectionAdapter.findConnection(fromStation, toStation);
    }

    async deleteValue(value: StationConnectionData): Promise<void> {
        const fromStation = this.scenario.getStation(value.fromStationID);
        const toStation = this.scenario.getStation(value.toStationID);
        await this.scenario.connectionAdapter.disconnect(fromStation, toStation);
    }

    private get hasFromStation(): boolean {
        return !!this.fromStation;
    }

    private get hasToStation(): boolean {
        return !!this.toStation;
    }

    protected override get canEdit() {
        return super.canEdit
            && this.hasFromStation
            && this.hasToStation;
    }

    protected override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            this.fromStation = this.scenario.getStation(this.value.fromStationID);
            this.toStation = this.scenario.getStation(this.value.toStationID);
        }
        else {
            this.fromStation = null;
            this.toStation = null;
        }

        elementSetText(this.toStationName,
            this.hasToStation
                ? this.toStation.fileName
                : "N/A");
    }

    protected override onRefresh() {
        super.onRefresh();

        this.selectStationButton.disabled = this.disabled
            || !this.hasToStation;
    }
}
