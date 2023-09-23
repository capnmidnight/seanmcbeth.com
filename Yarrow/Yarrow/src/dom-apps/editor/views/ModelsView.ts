import { classList, max, min, placeHolder, step } from "@juniper-lib/dom/attrs";
import { onInput } from "@juniper-lib/dom/evts";
import { Model_Gltf_Binary, Model_Gltf_Json } from "@juniper-lib/mediatypes";
import { formatNumber, parseNumber } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { InputRangeWithNumber } from "@juniper-lib/widgets/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import { FileData } from "../../../vr-apps/yarrow/data";
import type { Model } from "../../../vr-apps/yarrow/Model";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Asset, isStation } from "../models";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class ModelsView
    extends BaseScenarioFileObjectView<void, Model, Station> {

    private readonly sizeInput: InputRangeWithNumber;
    private readonly rotationXInput: InputRangeWithNumber;
    private readonly rotationYInput: InputRangeWithNumber;
    private readonly rotationZInput: InputRangeWithNumber;

    constructor(filePicker: FilePicker) {

        super(
            "Model",
            "Reset Model",
            filePicker,
            [
                Model_Gltf_Binary,
                Model_Gltf_Json
            ],
            [
                "model"
            ],
            [
                "Upload GLTF or GLB files",
                "Make sure 3D models are authored in units of meters"
            ]);

        const rotate = async () =>
            this.scenario.modelAdapter.setRotation(this.value, this.rotationX, this.rotationY, this.rotationZ);

        this.addProperties(
            ["Size",
                this.sizeInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(0),
                    max(10),
                    step(0.1),
                    placeHolder("Size"),
                    onInput(() =>
                        this.scenario.modelAdapter.setSize(this.value, this.size))
                )
            ],

            ["Pitch",
                this.rotationXInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotate)
                )
            ],

            ["Yaw",
                this.rotationYInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotate)
                )
            ],

            ["Roll",
                this.rotationZInput = new InputRangeWithNumber(
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotate)
                )
            ]);

        Object.seal(this);

        this.refreshValues();
    }

    protected getValueName(value: Model) {
        return value.fileName;
    }

    renameValue(value: Model, newName: string): void {
        this.scenario.modelAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Model) {
        await this.scenario.modelAdapter.reset(value, this.scenario.env.defaultAvatarHeight);
    }

    deleteValue(value: Model): Promise<void> {
        return this.scenario.modelAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Station {
        return isStation(parent);
    }

    protected onFileSelection(parent: Station, file: FileData, prog?: IProgress): Promise<Model> {
        return this.scenario.modelAdapter.create(parent, file, prog);
    }

    protected override get canEdit() {
        return super.canEdit
            && isNullOrUndefined(this.value.error);
    }

    private get size(): number {
        return parseNumber(this.sizeInput.value);
    }

    private set size(v: number) {
        this.sizeInput.value = formatNumber(v, 3);
    }

    private get rotationX(): number {
        return parseNumber(this.rotationXInput.value);
    }

    private set rotationX(v: number) {
        this.rotationXInput.value = formatNumber(v);
    }

    private get rotationY(): number {
        return parseNumber(this.rotationYInput.value);
    }

    private set rotationY(v: number) {
        this.rotationYInput.value = formatNumber(v);
    }

    private get rotationZ(): number {
        return parseNumber(this.rotationZInput.value);
    }

    private set rotationZ(v: number) {
        this.rotationZInput.value = formatNumber(v);
    }

    protected override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            this.size = this.value.size;
            this.rotationX = this.value.rotationX;
            this.rotationY = this.value.rotationY;
            this.rotationZ = this.value.rotationZ;
        }
        else {
            this.size = null;
            this.rotationX = null;
            this.rotationY = null;
            this.rotationZ = null;
        }
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.sizeInput.disabled
            = this.rotationXInput.disabled
            = this.rotationYInput.disabled
            = this.rotationZInput.disabled
            = !this.canEdit;
    }
}
