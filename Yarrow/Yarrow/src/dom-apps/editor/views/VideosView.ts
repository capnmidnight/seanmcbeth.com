import { autoComplete, classList, customData, max, min, placeHolder, step, value, wrap } from "@juniper-lib/dom/dist/attrs";
import { onInput } from "@juniper-lib/dom/dist/evts";
import { InputCheckbox, Option, Select, TextArea } from "@juniper-lib/dom/dist/tags";
import { Video_Mp4, Video_Mpeg, Video_Webm } from "@juniper-lib/mediatypes/dist";
import { SphereEncodingName, SphereEncodingNames, StereoLayoutName, StereoLayoutNames } from "@juniper-lib/threejs/dist/VideoPlayer3D";
import { formatNumber, formatVolume, parseNumber, parseVolume } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { InputRangeWithNumber } from "@juniper-lib/widgets/dist/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import { FileData, Video_Vnd_DlsDc_YtDlp_Json } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import type { Video } from "../../../vr-apps/yarrow/Video";
import { Asset, isStation } from "../models";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class VideosView
    extends BaseScenarioFileObjectView<void, Video, Station> {

    private readonly enabledInput: HTMLInputElement;
    private readonly labelInput: HTMLTextAreaElement;
    private readonly volumeInput: InputRangeWithNumber;
    private readonly sphereEncodingInput: HTMLSelectElement;
    private readonly stereoLayoutInput: HTMLSelectElement;
    private readonly sizeInput: InputRangeWithNumber;
    private readonly rotationXInput: InputRangeWithNumber;
    private readonly rotationYInput: InputRangeWithNumber;
    private readonly rotationZInput: InputRangeWithNumber;

    constructor(filePicker: FilePicker) {
        super(
            "Video",
            "Reset Video",
            filePicker,
            [
                Video_Mp4,
                Video_Mpeg,
                Video_Webm,
                Video_Vnd_DlsDc_YtDlp_Json
            ],
            [
                "video"
            ],
            [
                "Link to videos hosted on YouTube, or",
                "Upload WEBM, MP4, or MPG files."
            ]);

        const setType = () => {
            if (!this.scenario.videoAdapter.setSphereEncodingAndLayout(this.value, this.sphereEncoding, this.stereoLayout)) {
                this.sphereEncoding = this.value.sphereEncodingName;
                this.stereoLayout = this.value.stereoLayoutName;
            }
        };

        const saver = () => {
            this.scenario.videoAdapter.updateThrottled(this.value, {
                enabled: this.clipEnabled,
                label: this.label,
                volume: this.volume
            });
        };

        const rotate = () => {
            this.scenario.videoAdapter.setRotation(this.value, this.rotationX, this.rotationY, this.rotationZ);
        };

        this.addProperties(
            ["Enabled",
                this.enabledInput = InputCheckbox(
                    onInput(saver)
                )
            ],

            ["Label",
                this.labelInput = TextArea(
                    classList("form-control"),
                    placeHolder("Enter label"),
                    wrap("soft"),
                    autoComplete(false),
                    customData("lpignore", "true"),
                    onInput(saver)
                )
            ],

            ["Volume",
                this.volumeInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(0),
                    max(100),
                    step(1),
                    placeHolder("Volume"),
                    onInput(saver)
                )
            ],

            ["Type",
                this.sphereEncodingInput = Select(
                    classList("custom-select"),
                    onInput(setType),
                    ...SphereEncodingNames.map(n =>
                        Option(n, value(n)))
                )
            ],

            ["Layout",
                this.stereoLayoutInput = Select(
                    classList("custom-select"),
                    onInput(setType),
                    ...StereoLayoutNames.map(n =>
                        Option(n, value(n)))
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
                        this.scenario.videoAdapter.setSize(this.value, this.size))
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
                )],

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

        this.refreshValues();
    }

    protected getValueName(value: Video) {
        return value.fileName;
    }

    renameValue(value: Video, newName: string): void {
        this.scenario.videoAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Video) {
        await this.scenario.videoAdapter.reset(value, this.scenario.env.defaultAvatarHeight);
    }

    deleteValue(value: Video): Promise<void> {
        return this.scenario.videoAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Station {
        return isStation(parent);
    }

    protected onFileSelection(parent: Station, file: FileData, prog?: IProgress): Promise<Video> {
        return this.scenario.videoAdapter.create(parent, file, prog);
    }

    protected override get canEdit() {
        return super.canEdit
            && isNullOrUndefined(this.value.error);
    }

    private get clipEnabled(): boolean | null {
        if (this.enabledInput.indeterminate) {
            return null;
        }
        else {
            return this.enabledInput.checked;
        }
    }

    private set clipEnabled(v: boolean | null) {
        this.enabledInput.indeterminate = isNullOrUndefined(v);
        this.enabledInput.checked = isDefined(v) && v;
    }

    private get label(): string {
        return this.labelInput.value;
    }

    private set label(v: string) {
        this.labelInput.value = v;
    }

    private get volume(): number {
        return parseVolume(this.volumeInput.value);
    }

    private set volume(v: number) {
        this.volumeInput.value = formatVolume(v);
    }

    private get sphereEncoding(): SphereEncodingName {
        return this.sphereEncodingInput.value as SphereEncodingName;
    }

    private set sphereEncoding(v: SphereEncodingName) {
        this.sphereEncodingInput.value = v;
    }

    private get stereoLayout(): StereoLayoutName {
        return this.stereoLayoutInput.value as StereoLayoutName;
    }

    private set stereoLayout(v: StereoLayoutName) {
        this.stereoLayoutInput.value = v;
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
            this.clipEnabled = this.value.enabled;
            this.label = this.value.label;
            this.volume = this.value.volume;
            this.sphereEncoding = this.value.sphereEncodingName;
            this.stereoLayout = this.value.stereoLayoutName;
            this.size = this.value.size;
            this.rotationX = this.value.rotationX;
            this.rotationY = this.value.rotationY;
            this.rotationZ = this.value.rotationZ;
        }
        else {
            this.clipEnabled = null;
            this.label = null;
            this.volume = null;
            this.sphereEncoding = null;
            this.stereoLayout = null;
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
            = this.sphereEncodingInput.disabled
            = this.stereoLayoutInput.disabled
            = !this.canEdit;
    }
}
