import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { IDataLogger } from "@juniper-lib/tslib/dist/IDataLogger";
import { BaseScenario } from "./BaseScenario";
import type { FullScenarioData } from "./data";

export class Scenario extends BaseScenario {
    constructor(env: Environment, data: FullScenarioData, dataLogger: IDataLogger) {
        super(env, dataLogger, data);
    }
}