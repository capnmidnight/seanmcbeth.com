import { classList, max, min, placeHolder, step } from "@juniper-lib/dom/dist/attrs";
import { onInput } from "@juniper-lib/dom/dist/evts";
import { InputCheckbox, TextArea } from "@juniper-lib/dom/dist/tags";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Text_Plain } from "@juniper-lib/mediatypes/dist";
import { formatNumber, parseNumber } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { InputRangeWithNumber } from "@juniper-lib/widgets/dist/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import { FileData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { Text } from "../../../vr-apps/yarrow/Text";
import { Asset, isStation } from "../models";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class TextsView
    extends BaseScenarioFileObjectView<void, Text, Station> {

    private readonly textInput: HTMLTextAreaElement;
    private readonly isCalloutInput: HTMLInputElement;
    private readonly alwaysVisibleInput: HTMLInputElement;
    private readonly sizeInput: InputRangeWithNumber;
    private readonly rotationXInput: InputRangeWithNumber;
    private readonly rotationYInput: InputRangeWithNumber;
    private readonly rotationZInput: InputRangeWithNumber;

    constructor(filePicker: FilePicker) {
        super(
            "Text",
            "Reset Text",
            filePicker,
            [
                Text_Plain
            ],
            [
                "text"
            ],
            [
                "Upload TXT files",
                "Text item will not be visible in the app until the user clicks on the expand icon."
            ]);

        const rotate = async () =>
            this.scenario.textAdapter.setRotation(this.value, this.rotationX, this.rotationY, this.rotationZ);

        this.addProperties(
            ["Text",
                this.textInput = TextArea(
                    onInput(async () => {
                        if (this.hasValue) {
                            await this.scenario.textAdapter.updateThrottled(this.value, { text: this.textInput.value });
                            this.refreshValues();
                        }
                    })
                )
            ],
            ["Width",
                this.sizeInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(0),
                    max(10),
                    step(0.1),
                    placeHolder("Size"),
                    onInput(() =>
                        this.scenario.textAdapter.setSize(this.value, this.size))
                )
            ],

            ["Is Callout",
                this.isCalloutInput = InputCheckbox(
                    onInput(async () => {
                        await this.scenario.textAdapter.update(this.value, { isCallout: this.isCalloutInput.checked });
                        this.refreshValues();
                    })
                )
            ],

            ["Always Visible",
                this.alwaysVisibleInput = InputCheckbox(
                    onInput(async () => {
                        await this.scenario.textAdapter.update(this.value, { alwaysVisible: this.alwaysVisibleInput.checked });
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

    protected getValueName(value: Text) {
        return value.fileName;
    }

    renameValue(value: Text, newName: string): void {
        this.scenario.textAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Text) {
        await this.scenario.textAdapter.reset(value, this.scenario.env.defaultAvatarHeight);
    }

    deleteValue(value: Text): Promise<void> {
        return this.scenario.textAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Station {
        return isStation(parent);
    }

    protected override async getFile(parent: Station): Promise<FileData> {
        const form = new FormData();

        const siblings = this.scenario.textsByStation.get(parent) || [];
        const siblingNames = new Set(siblings.map(t => t.fileName));
        let fileName: string = null;
        for (let i = 0; fileName === null; ++i) {
            fileName = `Text Label ${i}`;
            if (siblingNames.has(fileName)) {
                fileName = null;
            }
        }

        fileName = Text_Plain.addExtension(fileName);

        const emptyFile = new File(["<Enter text>"], fileName, {
            type: Text_Plain.value
        });
        form.set("FormFile", emptyFile, fileName);
        form.set("Copyright", "Diplomatic Language Services");
        form.set("CopyrightDate", new Date(Date.now()).toDateString());
        form.set("TagString", "text");

        return this.scenario.env.fetcher
            .post("/editor/files/create")
            .body(form)
            .object<FileData>()
            .then(unwrapResponse);
    }

    protected onFileSelection(parent: Station, file: FileData, prog?: IProgress): Promise<Text> {
        return this.scenario.textAdapter.create(parent, file, prog);
    }

    protected override get canEdit() {
        return super.canEdit
            && isNullOrUndefined(this.value.error);
    }

    private get text() {
        return this.textInput.value;
    }

    private set text(v: string) {
        this.textInput.value = v;
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
            this.text = this.value.text;
            this.size = this.value.size;
            this.isCallout = this.value.isCallout;
            this.alwaysVisible = this.value.alwaysVisible;
            this.rotationX = this.value.rotationX;
            this.rotationY = this.value.rotationY;
            this.rotationZ = this.value.rotationZ;
        }
        else {
            this.text = null;
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

        this.textInput.disabled
            = this.sizeInput.disabled
            = this.isCalloutInput.disabled
            = this.alwaysVisibleInput.disabled
            = this.rotationXInput.disabled
            = this.rotationYInput.disabled
            = this.rotationZInput.disabled
            = !this.canEdit;
    }
}
