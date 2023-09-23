import { classList, max, min, placeHolder, step } from "@juniper-lib/dom/attrs";
import { onInput } from "@juniper-lib/dom/evts";
import { InputCheckbox } from "@juniper-lib/dom/tags";
import { Application_Pdf, Image_Jpeg, Image_Png } from "@juniper-lib/mediatypes";
import { formatNumber, parseNumber } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { InputRangeWithNumber } from "@juniper-lib/widgets/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import { DEMO_DIM, DEMO_PPI, DEMO_PX } from "../../../settings";
import { FileData } from "../../../vr-apps/yarrow/data";
import type { Sign } from "../../../vr-apps/yarrow/Sign";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Asset, isStation } from "../models";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class SignsView
    extends BaseScenarioFileObjectView<void, Sign, Station> {

    private readonly isCalloutInput: HTMLInputElement;
    private readonly alwaysVisibleInput: HTMLInputElement;
    private readonly sizeInput: InputRangeWithNumber;
    private readonly rotationXInput: InputRangeWithNumber;
    private readonly rotationYInput: InputRangeWithNumber;
    private readonly rotationZInput: InputRangeWithNumber;

    constructor(filePicker: FilePicker) {
        super(
            "Sign",
            "Reset Sign",
            filePicker,
            [
                Image_Jpeg,
                Image_Png,
                Application_Pdf
            ],
            [
                "sign"
            ],
            [
                "Upload PNG, JPEG, or PDF files",
                "Signs should be authored at the dimensions they would appear in the real world.",
                `PNG or JPEG files should be authored at ${DEMO_PPI} pixels per inch, e.g. a ${DEMO_DIM} in wide sign should be ${DEMO_PX} px wide.`,
                "Callout signs will not be visible in the app until the user clicks on the expand icon."
            ]);

        const rotate = async () =>
            this.scenario.signAdapter.setRotation(this.value, this.rotationX, this.rotationY, this.rotationZ);

        this.addProperties(
            ["Width",
                this.sizeInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(0),
                    max(10),
                    step(0.1),
                    placeHolder("Size"),
                    onInput(() =>
                        this.scenario.signAdapter.setSize(this.value, this.size))
                )
            ],

            ["Is Callout",
                this.isCalloutInput = InputCheckbox(
                    onInput(async () => {
                        await this.scenario.signAdapter.update(this.value, { isCallout: this.isCalloutInput.checked });
                        this.refreshValues();
                    })
                )
            ],

            ["Always Visible",
                this.alwaysVisibleInput = InputCheckbox(
                    onInput(async () => {
                        await this.scenario.signAdapter.update(this.value, { alwaysVisible: this.alwaysVisibleInput.checked });
                        this.refreshValues();
                    })
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
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotate)
                )
            ]);

        Object.seal(this);

        this.refresh();
    }

    protected getValueName(value: Sign) {
        return value.fileName;
    }

    renameValue(value: Sign, newName: string): void {
        this.scenario.signAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Sign) {
        await this.scenario.signAdapter.reset(value, this.scenario.env.defaultAvatarHeight);
    }

    deleteValue(value: Sign): Promise<void> {
        return this.scenario.signAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Station {
        return isStation(parent);
    }

    protected onFileSelection(parent: Station, file: FileData, prog?: IProgress): Promise<Sign> {
        return this.scenario.signAdapter.create(parent, file, prog);
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

    private get isCallout(): boolean {
        if (this.isCalloutInput.indeterminate) {
            return null;
        }
        else {
            return this.isCalloutInput.checked;
        }
    }

    private set isCallout(v: boolean) {
        this.isCalloutInput.indeterminate = isNullOrUndefined(v);
        this.isCalloutInput.checked = isDefined(v) && v;
    }

    private get alwaysVisible(): boolean {
        if (this.alwaysVisibleInput.indeterminate) {
            return null;
        }
        else {
            return this.alwaysVisibleInput.checked;
        }
    }

    private set alwaysVisible(v: boolean) {
        this.alwaysVisibleInput.indeterminate = isNullOrUndefined(v);
        this.alwaysVisibleInput.checked = isDefined(v) && v;
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

    override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            this.size = this.value.size;
            this.isCallout = this.value.isCallout;
            this.alwaysVisible = this.value.alwaysVisible;
            this.rotationX = this.value.rotationX;
            this.rotationY = this.value.rotationY;
            this.rotationZ = this.value.rotationZ;
        }
        else {
            this.size = null;
            this.isCallout = null;
            this.alwaysVisible = null;
            this.rotationX = null;
            this.rotationY = null;
            this.rotationZ = null;
        }
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.sizeInput.disabled
            = this.isCalloutInput.disabled
            = this.alwaysVisibleInput.disabled
            = this.rotationXInput.disabled
            = this.rotationYInput.disabled
            = this.rotationZInput.disabled
            = !this.canEdit;
    }
}
