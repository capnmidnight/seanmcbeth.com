import { CanvasImageTypes } from "@juniper-lib/dom/canvas";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { PDFImage } from "@juniper-lib/graphics2d/PDFImage";
import { Application_Pdf } from "@juniper-lib/mediatypes";
import { coallesce } from "@juniper-lib/collections/coallesce";
import { deg2rad } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/progressSplit";
import { inches2Meters } from "@juniper-lib/tslib/units/length";
import { DEMO_PPI } from "../../../settings";
import type { FileData, SignData, TransformData } from "../../../vr-apps/yarrow/data";
import type { Sign } from "../../../vr-apps/yarrow/Sign";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { EditableScenario } from "../EditableScenario";
import { AssetSelectedEvent } from "../models";
import { BaseScenarioFileAssetAdapter } from "./BaseScenarioFileAssetAdapter";
import { EditableScenarioMarkerSelectedEvent } from "./StationAdapter";

const signIcon = "painting";

interface SignCreateOutput {
    sign: SignData;
    transform: TransformData;
}

interface SignCreateInput {
    parentTransformID: number;
    fileID: number;
    imageWidth: number;
    imageHeight: number;
}

interface SignUpdateInput {
    id: number;
    fileName: string;
    isCallout: boolean;
    alwaysVisible: boolean;
}

export class EditableScenarioSignSelectedEvent extends EditableScenarioMarkerSelectedEvent<"sign", Sign> {
    constructor(sign: Sign) {
        super("sign", sign);
    }
}

export class SignsAdapter extends BaseScenarioFileAssetAdapter<Sign, SignCreateInput, SignCreateOutput> {
    constructor(scenario: EditableScenario) {
        super(scenario, scenario.signs, scenario.signsByStation, "Signs");
    }

    private async loadSignImage(fileInfo: FileData, progress?: IProgress): Promise<CanvasImageTypes> {
        const response = await this.scenario.env
            .fetcher
            .get(fileInfo.filePath)
            .progress(progress)
            .file();

        if (Application_Pdf.matches(response.contentType)) {
            const pdf = new PDFImage(response.content, { scale: 2 });
            await pdf.getPage(0);
            return pdf.canvas;
        }
        else {
            return await this.scenario.env
                .fetcher
                .get(response.content)
                .image()
                .then(unwrapResponse);
        }
    }

    protected override createAsset(output: SignCreateOutput, download: IProgress): Promise<Sign> {
        return this.scenario.createSign(output.sign, download);
    }

    async create(station: Station, file: FileData, prog?: IProgress): Promise<Sign> {
        const [info, upload, download] = progressSplitWeighted(prog, [1, 2, 1]);
        const img = await this.loadSignImage(file, info);

        const input: SignCreateInput = {
            parentTransformID: (station || this.scenario.rootTransform).transformID,
            fileID: file.id,
            imageWidth: img.width,
            imageHeight: img.height
        };

        return await this.createTransformAndSaveAsset(input, upload, download);
    }

    protected override getMarkerImagePath() {
        return signIcon;
    }

    protected override onMarkerSelected(obj: Sign, isContenxtMenu: boolean) {
        this.scenario.dispatchEvent(new EditableScenarioSignSelectedEvent(obj));
        this.scenario.dispatchEvent(new AssetSelectedEvent(obj, isContenxtMenu));
    }

    override resetThrottled(sign: Sign, defaultAvatarHeight: number): void {
        const inches = sign.image.imageWidth / DEMO_PPI;
        const meters = inches2Meters(inches);
        sign.size = meters;
        super.resetThrottled(sign, defaultAvatarHeight);
    }

    override async reset(sign: Sign, defaultAvatarHeight: number): Promise<void> {
        const inches = sign.image.imageWidth / DEMO_PPI;
        const meters = inches2Meters(inches);
        sign.size = meters;
        await super.resetThrottled(sign, defaultAvatarHeight);
    }

    async update(sign: Sign, newData: Partial<SignUpdateInput>): Promise<void> {
        this.setUpdateData(newData, sign);
        await this.scenario.post("Update", "Signs", newData);
        this.getUpdateData(sign, newData);
    }

    updateThrottled(sign: Sign, newData: Partial<SignUpdateInput>): void {
        this.setUpdateData(newData, sign);
        this.scenario.throttle(`updateSign::${newData.id}`, () =>
            this.scenario.post("Update", "Signs", newData));
        this.getUpdateData(sign, newData);
    }

    private copy(overwrite: boolean, to: Partial<SignUpdateInput>, from: Partial<SignUpdateInput>): void {
        coallesce(overwrite, to, from,
            "fileName",
            "isCallout",
            "alwaysVisible"
        );
    }

    private setUpdateData(newData: Partial<SignUpdateInput>, sign: Sign) {
        newData.id = sign.key;
        this.copy(false, newData, sign);
    }

    private getUpdateData(sign: Sign, newData: Partial<SignUpdateInput>) {
        this.copy(true, sign, newData);
    }

    setSize(sign: Sign, size: number): void {
        sign.size = size;
        const transform = this.scenario.getTransform(sign.transformID);
        this.saveTransformThrottled(sign, transform);
    }

    setRotation(sign: Sign, pitchDegrees: number, yawDegrees: number, rollDegrees: number): void {
        const transform = this.scenario.getTransform(sign.transformID);
        transform.rotation.set(
            deg2rad(pitchDegrees),
            deg2rad(yawDegrees),
            deg2rad(rollDegrees),
            "XYZ");
        this.saveTransformThrottled(sign, transform);
    }

    getStation(sign: Sign): Station {
        const transform = sign && this.scenario.getTransform(sign.transformID);
        return transform && this.scenario.findStation(transform);
    }
}
