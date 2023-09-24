import { autoComplete, classList, customData, max, min, placeHolder, step, wrap } from "@juniper-lib/dom/dist/attrs";
import { onInput } from "@juniper-lib/dom/dist/evts";
import { InputCheckbox, TextArea } from "@juniper-lib/dom/dist/tags";
import { Audio_Mpeg, Audio_Webm } from "@juniper-lib/mediatypes/dist";
import { formatVolume, parseVolume } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { InputRangeWithNumber } from "@juniper-lib/widgets/dist/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import type { Audio } from "../../../vr-apps/yarrow/Audio";
import { FileData } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { Asset, isStation } from "../models";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class AudiosView
    extends BaseScenarioFileObjectView<void, Audio, Station> {

    private readonly labelInput: HTMLTextAreaElement;
    private readonly enabledInput: HTMLInputElement;
    private readonly volumeInput: InputRangeWithNumber;

    constructor(filePicker: FilePicker) {

        super(
            "Audio",
            "Reset Audio",
            filePicker,
            [
                Audio_Mpeg,
                Audio_Webm
            ],
            [
                "voiceover"
            ],
            [
                "Upload MP3 or WEBA files"
            ]);

        const saver = () => {
            this.scenario.audioAdapter.updateThrottled(this.value, {
                enabled: this.trackEnabled,
                label: this.label,
                volume: this.volume
            });
        };

        this.addProperties(
            ["Enabled",
                this.enabledInput = InputCheckbox(onInput(saver))
            ],

            ["Label",
                this.labelInput = TextArea(
                    placeHolder("Enter label"),
                    classList("form-control"),
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
            ]);

        Object.seal(this);

        this.refreshValues();
    }

    protected getValueName(value: Audio) {
        return value.fileName;
    }

    renameValue(value: Audio, newName: string): void {
        this.scenario.audioAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Audio) {
        await this.scenario.audioAdapter.reset(value, this.scenario.env.defaultAvatarHeight);
    }

    deleteValue(value: Audio): Promise<void> {
        return this.scenario.audioAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Station {
        return isStation(parent);
    }

    protected onFileSelection(parent: Station, file: FileData, prog?: IProgress): Promise<Audio> {
        return this.scenario.audioAdapter.create(parent, file, prog);
    }

    protected override get canEdit() {
        return super.canEdit
            && isNullOrUndefined(this.value.error);
    }

    private get label(): string {
        return this.labelInput.value
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

    private get trackEnabled(): boolean | null {
        if (this.enabledInput.indeterminate) {
            return null;
        }
        else {
            return this.enabledInput.checked;
        }
    }

    private set trackEnabled(v: boolean | null) {
        this.enabledInput.indeterminate = isNullOrUndefined(v);
        this.enabledInput.checked = isDefined(v) && v;
    }

    protected override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            this.label = this.value.label;
            this.volume = this.value.volume;
            this.trackEnabled = this.value.enabled;
        }
        else {
            this.label = "";
            this.volume = null;
            this.trackEnabled = null;
        }
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.labelInput.disabled
            = this.volumeInput.disabled
            = this.enabledInput.disabled
            = !this.canEdit;
    }
}

