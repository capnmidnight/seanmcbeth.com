import { coallesce } from "@juniper-lib/collections/coallesce";
import { deg2rad } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/progressSplit";
import type { FileData, ModelData, TransformData } from "../../../vr-apps/yarrow/data";
import type { Model } from "../../../vr-apps/yarrow/Model";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { EditableScenario } from "../EditableScenario";
import { AssetSelectedEvent } from "../models";
import { BaseScenarioFileAssetAdapter } from "./BaseScenarioFileAssetAdapter";
import { EditableScenarioMarkerSelectedEvent } from "./StationAdapter";

const modelIcon = "joy";

export class EditableScenarioModelSelectedEvent extends EditableScenarioMarkerSelectedEvent<"model", Model> {
    constructor(model: Model) {
        super("model", model);
    }
}

interface ModelCreateInput {
    fileID: number,
    parentTransformID: number;
}

export interface ModelUpdateInput {
    id: number;
    fileName: string;
}

interface ModelCreateOutput {
    model: ModelData;
    transform: TransformData;
}

export class ModelsAdapter extends BaseScenarioFileAssetAdapter<Model, ModelCreateInput, ModelCreateOutput> {
    constructor(scenario: EditableScenario) {
        super(scenario, scenario.models, scenario.modelsByStation, "Models");
    }

    protected override createAsset(output: ModelCreateOutput, download: IProgress): Promise<Model> {
        return this.scenario.createModel(output.model, download);
    }

    create(station: Station, file: FileData, prog?: IProgress): Promise<Model> {
        const [upload, download] = progressSplitWeighted(prog, [2, 1]);

        const parent = station || this.scenario.rootTransform;

        const input: ModelCreateInput = {
            fileID: file.id,
            parentTransformID: parent.transformID
        };

        return this.createTransformAndSaveAsset(input, upload, download);
    }

    protected override getMarkerImagePath() {
        return modelIcon;
    }

    protected override onMarkerSelected(obj: Model, isContenxtMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioModelSelectedEvent(obj));
        this.scenario.dispatchEvent(new AssetSelectedEvent(obj, isContenxtMenu));
    }

    setSize(model: Model, size: number): void {
        const transform = this.scenario.getTransform(model.transformID);
        model.size = size;
        this.saveTransformThrottled(model, transform);
    }

    setRotation(model: Model, pitchDegrees: number, yawDegrees: number, rollDegrees: number): void {
        const transform = this.scenario.getTransform(model.transformID);
        transform.rotation.set(
            deg2rad(pitchDegrees),
            deg2rad(yawDegrees),
            deg2rad(rollDegrees),
            "XYZ");
        this.saveTransformThrottled(model, transform);
    }

    getStation(model: Model): Station {
        const transform = model && this.scenario.getTransform(model.transformID);
        return transform && this.scenario.findStation(transform);
    }

    async update(model: Model, newData: Partial<ModelUpdateInput>): Promise<void> {
        this.setUpdateData(newData, model);
        await this.scenario.post("Update", "Models", newData);
        this.getUpdateData(model, newData);
    }

    updateThrottled(model: Model, newData: Partial<ModelUpdateInput>): void {
        this.setUpdateData(newData, model);
        this.scenario.throttle(`updateModel::${newData.id}`, () =>
            this.scenario.post("Update", "Models", newData));
        this.getUpdateData(model, newData);
    }

    private copy(overwrite: boolean, to: Partial<ModelUpdateInput>, from: Partial<ModelUpdateInput>): void {
        coallesce(overwrite, to, from, "fileName");
    }

    private getUpdateData(model: Model, newData: Partial<ModelUpdateInput>) {
        this.copy(true, model, newData);
    }

    private setUpdateData(newData: Partial<ModelUpdateInput>, model: Model) {
        newData.id = model.key;
        this.copy(false, newData, model);
    }
}