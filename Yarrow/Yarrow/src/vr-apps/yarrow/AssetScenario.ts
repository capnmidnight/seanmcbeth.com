import { BaseAsset } from "@juniper-lib/fetcher/dist/Asset";
import { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes/dist";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { IDataLogger } from "@juniper-lib/tslib/dist/IDataLogger";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import type { BaseScenario } from "./BaseScenario";
import { FullScenarioData } from "./data";
import { Scenario } from "./Scenario";

export abstract class BaseAssetScenario<T extends BaseScenario<unknown>> extends BaseAsset<T> {

    constructor(path: string) {
        super(path, Application_JsonUTF8);
    }

    protected abstract createScenario(data: FullScenarioData): T;

    protected async getResult(fetcher: IFetcher, prog?: IProgress): Promise<T> {
        const [metaLoad, assetLoad] = progressSplitWeighted(prog, [1, 89]);
        return await fetcher
            .get(this.path)
            .progress(metaLoad)
            .object<FullScenarioData>()
            .then(unwrapResponse)
            .then(async data => {
                const scenario = this.createScenario(data);
                await scenario.loadAssets(assetLoad);
                return scenario;
            });
    }

}


export class AssetScenario extends BaseAssetScenario<Scenario> {
    constructor(private readonly env: Environment, scenarioID: number, private readonly dataLogger: IDataLogger) {
        super(`/vr/scenario/${scenarioID}`);
    }

    protected createScenario(data: FullScenarioData): Scenario {
        return new Scenario(this.env, data, this.dataLogger);
    }
}