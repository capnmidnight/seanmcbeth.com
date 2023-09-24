import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonDangerSmall, HtmlRender } from "@juniper-lib/dom/dist/tags";
import { TransformMode } from "@juniper-lib/threejs/dist/TransformEditor";
import { Asset, AssetResetEvent, isConnection, ResetableAsset, ResetableAssetEvents } from "../models";
import { BaseScenarioObjectView } from "./BaseScenarioObjectView";

export abstract class BaseScenarioResetableObjectView<EventsT, ValueT extends ResetableAsset, ParentT extends Asset>
    extends BaseScenarioObjectView<EventsT & ResetableAssetEvents<ValueT>, ValueT, ParentT>{

    protected readonly resetButton: HTMLButtonElement;

    constructor(title: string, resetButtonText: string, tips?: string[]) {
        super(title, tips);
        this.addAssetControls(
            this.resetButton = ButtonDangerSmall(
                resetButtonText,
                onClick(() => this.dispatchEvent(new AssetResetEvent(this.value)))
            )
        );
        HtmlRender(
            this.element
        );
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.resetButton.disabled
            = !this.canEdit;
    }

    abstract resetValue(value: ValueT): Promise<void>;

    getTransformModes(_value: ValueT): TransformMode[] {
        return [
            TransformMode.Orbit,
            TransformMode.RotateGlobalSpace,
            TransformMode.RotateObjectSpace,
            TransformMode.RotateViewSpace,
            TransformMode.Resize,
            TransformMode.MoveGlobalSpace,
            TransformMode.MoveObjectSpace,
            TransformMode.MoveViewSpace
        ];
    }

    updateTransformView(value: ValueT): void {
        if (value === this.value) {
            this.refreshValues();
        }

        if (!isConnection(value)) {
            const transform = this.scenario.getTransform(value.transformID);
            this.scenario.transformAdapter.updateMarker(transform, value);
        }
    }

    saveTransform(value: ValueT): Promise<void> {
        const transform = this.scenario.getTransform(value.transformID);
        return this.scenario.transformAdapter.saveMatrix(transform);
    }
}