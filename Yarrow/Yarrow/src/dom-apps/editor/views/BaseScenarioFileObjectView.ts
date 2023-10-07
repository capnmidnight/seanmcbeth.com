import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimarySmall } from "@juniper-lib/dom/dist/tags";
import { TypedEventMap } from "@juniper-lib/events/dist/TypedEventTarget";
import { MediaType } from "@juniper-lib/mediatypes/dist";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { FilePicker } from "../../../file-picker/FilePicker";
import { FileData } from "../../../vr-apps/yarrow/data";
import { Asset, AssetViewFileEvent, FileAsset, FileAssetEvents } from "../models";
import { BaseScenarioResetableObjectView } from "./BaseScenarioResetableObjectView";

export abstract class BaseScenarioFileObjectView<EventsT extends TypedEventMap<string>, ValueT extends FileAsset, ParentT extends Asset>
    extends BaseScenarioResetableObjectView<EventsT & FileAssetEvents<ValueT>, ValueT, ParentT>{

    private readonly detailButton: HTMLButtonElement;

    constructor(
        title: string,
        resetButtonText: string,
        private readonly filePicker: FilePicker,
        private readonly fileTypes: MediaType[],
        private readonly fileTags: string[],
        tips?: string[]) {
        super(title, resetButtonText, tips);

        this.addAssetControls(
            this.detailButton = ButtonPrimarySmall(
                "View File Detail",
                onClick(() => this.dispatchEvent(new AssetViewFileEvent(this.value)))
            )
        );
    }

    async reloadFile() {
        await this.scenario.env.fetcher.evict(this.value.filePath);
        await this.value.reload(this.scenario.env.loadingBar);
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.detailButton.disabled = !this.canEdit;
    }

    async createValue(parent: ParentT, prog?: IProgress): Promise<ValueT> {
        if (!this.validateParent(parent)) {
            throw new Error("Incorrect parent type.");
        }

        const file = await this.getFile(parent);
        if (isDefined(file)) {
            return await this.onFileSelection(parent, file, prog);
        }

        return null;
    }

    protected async getFile(_parent: ParentT): Promise<FileData> {
        this.filePicker.setTypeFilters(...this.fileTypes);
        this.filePicker.setTags(...this.fileTags);
        if (await this.filePicker.showDialog()
            && isDefined(this.filePicker.selectedFile)) {
            return this.filePicker.selectedFile;
        }

        return null;
    }

    protected abstract validateParent(parent: Asset): parent is ParentT;

    protected abstract onFileSelection(parent: ParentT, file: FileData, prog?: IProgress): Promise<ValueT>;
}