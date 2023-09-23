import type { Environment } from "@juniper-lib/threejs/environment/Environment";
import { IDataLogger } from "@juniper-lib/tslib/IDataLogger";
import { BaseAssetScenario } from "../../vr-apps/yarrow/AssetScenario";
import { FullScenarioData } from "../../vr-apps/yarrow/data";
import { EditableScenario } from "./EditableScenario";
import { IMapView } from "./views/MapView";


export class AssetEditableScenario extends BaseAssetScenario<EditableScenario> {
    constructor(
        private readonly env: Environment,
        private readonly dataLogger: IDataLogger,
        private readonly map: IMapView,
        scenarioID: number) {
        super(`/editor/scenarios/layout/${scenarioID}`);
    }

    protected createScenario(data: FullScenarioData): EditableScenario {
        return new EditableScenario(this.env, data, this.dataLogger, this.map);
    }
}