import { coallesce } from "@juniper-lib/collections/dist/coallesce";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { deg2rad } from "@juniper-lib/tslib/dist/math";
import { inches2Meters } from "@juniper-lib/tslib/dist/units/length";
import { DEMO_PPI } from "../../../settings";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { Text } from "../../../vr-apps/yarrow/Text";
import type { FileData, TextData, TransformData } from "../../../vr-apps/yarrow/data";
import type { EditableScenario } from "../EditableScenario";
import { AssetSelectedEvent } from "../models";
import { BaseScenarioFileAssetAdapter } from "./BaseScenarioFileAssetAdapter";
import { EditableScenarioMarkerSelectedEvent } from "./StationAdapter";

const textIcon = "pad";

interface TextCreateOutput {
    text: TextData;
    transform: TransformData;
}

interface TextCreateInput {
    parentTransformID: number;
    fileID: number;
}

interface TextUpdateInput {
    id: number;
    text: string;
    fileName: string;
    isCallout: boolean;
    alwaysVisible: boolean;
}

export class EditableScenarioTextSelectedEvent extends EditableScenarioMarkerSelectedEvent<"text", Text> {
    constructor(text: Text) {
        super("text", text);
    }
}

export class TextsAdapter extends BaseScenarioFileAssetAdapter<Text, TextCreateInput, TextCreateOutput> {
    constructor(scenario: EditableScenario) {
        super(scenario, scenario.texts, scenario.textsByStation, "Texts");
    }

    protected override createAsset(output: TextCreateOutput, download: IProgress): Promise<Text> {
        return this.scenario.createText(output.text, download);
    }

    async create(station: Station, file: FileData, prog?: IProgress): Promise<Text> {
        const [upload, download] = progressSplitWeighted(prog, [1, 1]);

        const input: TextCreateInput = {
            parentTransformID: (station || this.scenario.rootTransform).transformID,
            fileID: file.id
        };

        return await this.createTransformAndSaveAsset(input, upload, download);
    }

    protected override getMarkerImagePath() {
        return textIcon;
    }

    protected override onMarkerSelected(obj: Text, isContenxtMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioTextSelectedEvent(obj));
        this.scenario.dispatchEvent(new AssetSelectedEvent(obj, isContenxtMenu));
    }

    override resetThrottled(text: Text, defaultAvatarHeight: number): void {
        const inches = text.image.imageWidth / DEMO_PPI;
        const meters = inches2Meters(inches);
        text.size = meters;
        super.resetThrottled(text, defaultAvatarHeight);
    }

    override async reset(text: Text, defaultAvatarHeight: number): Promise<void> {
        const inches = text.image.imageWidth / DEMO_PPI;
        const meters = inches2Meters(inches);
        text.size = meters;
        await super.resetThrottled(text, defaultAvatarHeight);
    }

    async update(text: Text, newData: Partial<TextUpdateInput>): Promise<void> {
        this.setUpdateData(newData, text);
        await this.scenario.post("Update", "Texts", newData);
        this.getUpdateData(text, newData);
    }

    updateThrottled(text: Text, newData: Partial<TextUpdateInput>): void {
        this.setUpdateData(newData, text);
        this.scenario.throttle(`updateText::${newData.id}`, () =>
            this.scenario.post("Update", "Texts", newData));
        this.getUpdateData(text, newData);
    }

    private copy(overwrite: boolean, to: Partial<TextUpdateInput>, from: Partial<TextUpdateInput>): void {
        coallesce(overwrite, to, from,
            "text",
            "fileName",
            "isCallout",
            "alwaysVisible"
        );
    }

    private setUpdateData(newData: Partial<TextUpdateInput>, text: Text) {
        newData.id = text.key;
        this.copy(false, newData, text);
    }

    private getUpdateData(text: Text, newData: Partial<TextUpdateInput>) {
        this.copy(true, text, newData);
    }

    setSize(text: Text, size: number): void {
        text.size = size;
        const transform = this.scenario.getTransform(text.transformID);
        this.saveTransformThrottled(text, transform);
    }

    setRotation(text: Text, pitchDegrees: number, yawDegrees: number, rollDegrees: number): void {
        const transform = this.scenario.getTransform(text.transformID);
        transform.rotation.set(
            deg2rad(pitchDegrees),
            deg2rad(yawDegrees),
            deg2rad(rollDegrees),
            "XYZ");
        this.saveTransformThrottled(text, transform);
    }

    getStation(text: Text): Station {
        const transform = text && this.scenario.getTransform(text.transformID);
        return transform && this.scenario.findStation(transform);
    }
}
