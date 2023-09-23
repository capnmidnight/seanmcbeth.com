import { Zone } from "../../../vr-apps/yarrow/data";
import { BaseScenarioObjectView } from "./BaseScenarioObjectView";


function isDefault(v: string): boolean {
    return /^default$/i.test(v);
}

export class ZoneView extends BaseScenarioObjectView<void, Zone, never> {
    constructor() {
        super("Zone", [
            "Use zones to group environment audio and stations",
            "Environment audio will only be played when the user is in a station grouped in the same zone as the audio",
            "The Default zone cannot be renamed or deleted",
            "Empty zones won't be saved"
        ], false);

        Object.seal(this);

        Object.assign(window, { zones: this });

        this.refreshValues();
    }

    protected getValueName(value: Zone): string {
        return value || "Default";
    }

    deleteValue(value: Zone): Promise<void> {
        this.renameValue(value, "");
        return Promise.resolve();
    }

    renameValue(value: Zone, newName: string): void {
        this.scenario.audios
            .filter(audio => audio.spatialize && audio.zone === value)
            .forEach(audio =>
                this.scenario.audioAdapter.updateThrottled(audio, { zone: newName }));

        this.scenario.stations
            .filter(station => station.zone === value)
            .forEach(station =>
                this.scenario.stationAdapter.updateThrottled(station, { zone: newName }));

        this.scenario.refreshZones();
    }

    createValue(): Promise<Zone> {
        let counter = 0;
        let name: string = null;
        do {
            name = counter === 0 ? "New Zone" : `New Zone - ${counter}`;
            ++counter;
        } while (this.scenario.zones.indexOf(name) > -1);

        this.scenario.zones.push(name);

        return Promise.resolve(name);
    }

    protected override get canEdit() {
        return super.canEdit
            && !isDefault(this.getValueName(this.value));
    }

    protected override get canRename() {
        return super.canRename
            && this.name.length > 0
            && !isDefault(this.name.toLowerCase());
    }
}