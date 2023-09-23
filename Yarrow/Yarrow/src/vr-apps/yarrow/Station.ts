import { ILatLngPoint } from "@juniper-lib/gis/LatLngPoint";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { BaseScenario } from "./BaseScenario";
import { StationData } from "./data";


export class Station implements StationData {

    readonly key: number;
    readonly scenarioID: number;
    readonly transformID: number;
    readonly fileID: number;
    readonly filePath: string;
    readonly fileTagString: string;
    readonly mediaType: string;
    readonly trueMediaType: string;
    readonly copyright: string;
    readonly copyrightDate: Date;
    readonly location: ILatLngPoint;
    zone: string;
    label: string;
    rotation: number[];
    fileName: string;

    constructor(private readonly scenario: BaseScenario, data: StationData) {
        this.key = data.key;
        this.scenarioID = data.scenarioID;
        this.transformID = data.transformID;
        this.fileID = data.fileID;
        this.fileName = data.fileName;
        this.filePath = data.filePath;
        this.fileTagString = data.fileTagString;
        this.mediaType = data.mediaType;
        this.trueMediaType = data.trueMediaType;
        this.copyright = data.copyright;
        this.copyrightDate = data.copyrightDate;
        this.location = data.location;
        this.zone = data.zone;
        this.label = data.label;
        this.rotation = data.rotation;
    }

    async reload(prog?: IProgress): Promise<void> {
        this.scenario.evict(this);
        if (this.scenario.curStation === this) {
            await this.scenario.env.withFade(async () => {
                this.scenario.env.skybox.clear();
                await this.scenario.showStation(this, false, prog);
            });
        }
    }
}