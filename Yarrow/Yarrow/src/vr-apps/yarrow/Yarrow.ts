import { Application } from "@juniper-lib/threejs/dist/environment/Application";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { Exception } from "@juniper-lib/tslib/dist/Exception";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined, isNumber, isString } from "@juniper-lib/tslib/dist/typeChecks";
import { AssetScenario } from "./AssetScenario";
import { Scenario } from "./Scenario";

export class Yarrow extends Application {
    scenarioID: number = null;
    private scenario: Scenario = null;

    constructor(env: Environment) {
        super(env);

        this.env.audio.setAudioProperties(1, 4, "exponential");

        Object.seal(this);

        Object.assign(window, {
            yarrow: this
        });
    }

    override async init(params: Map<string, unknown>): Promise<void> {
        let scenarioIdNumOrString = params.get("scenarioID") as number | string;
        if (isString(scenarioIdNumOrString)) {
            scenarioIdNumOrString = parseFloat(scenarioIdNumOrString);
        }

        this.scenarioID = scenarioIdNumOrString;

        if (!isNumber(this.scenarioID)) {
            throw new Exception("Expected integer scenario ID");
        }

        await super.init(params);
    }

    async load(prog?: IProgress) {
        const scenarioAsset = new AssetScenario(this.env, this.scenarioID, this);
        await this.env.fetcher.assets(prog, scenarioAsset);
        this.scenario = scenarioAsset.result;
    }

    protected async showing(prog?: IProgress) {
        this.join(this.scenario.roomName);
        await this.scenario.showStart(prog);
    }

    protected hiding() {
        // nothing to do
    }

    dispose() {
        this.scenario.dispose();
        this.env.removeScope(this);

        this.scenario = null;
        this.scenarioID = null;
    }

    get visible() {
        return isDefined(this.scenario);
    }
}
