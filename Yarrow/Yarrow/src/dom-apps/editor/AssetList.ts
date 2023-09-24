import { Attr } from "@juniper-lib/dom/dist/attrs";
import { CssElementStyleProp } from "@juniper-lib/dom/dist/css";
import { lockedWithKey, questionMark, star } from "@juniper-lib/emoji/dist";
import { arrayInsertAt } from "@juniper-lib/collections/dist/arrays";
import { buildTree } from "@juniper-lib/collections/dist/TreeNode";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { TreeView } from "@juniper-lib/widgets/dist/TreeView";
import { Station } from "../../vr-apps/yarrow/Station";
import { EditableScenario } from "../editor/EditableScenario";
import { Asset, assetIcons, assetNames, DeletableAsset, DeletableAssetKind, DeletableAssetKindValues, getAssetKind, isAmbientAudio, isAudio, isConnection, isModel, isScenario, isSign, isStation, isText, isVideo, isVoiceOver, isZone } from "./models";


export class AssetList extends TreeView<Asset, DeletableAssetKind>{

    private _scenario: EditableScenario = null;

    constructor(...styleProps: (CssElementStyleProp | Attr<"id">)[]) {

        super({
            showNameFilter: true,
            typeFilters: {
                getTypes: () => DeletableAssetKindValues,
                getTypeLabel: type => assetNames.get(type),
                getTypeFor: asset => getAssetKind(asset as DeletableAsset)
            },
            getLabel: asset => {
                const kind = getAssetKind(asset);
                const name = this.getAssetName(asset);

                if (isNullOrUndefined(name)) {
                    return questionMark.emojiStyle + "N/A";
                }

                let icon = assetIcons.get(kind);
                if (this.isStartStation(asset)) {
                    icon += star.emojiStyle;
                }

                return icon + " " + name;
            },
            getParent: v => this.getAssetParent(v),
            getOrder: v => this.getAssetOrder(v),
            getDescription: asset =>
                getAssetKind(asset)
                || "N/A",
            canReorder: asset =>
                isZone(asset)
                || isStation(asset)
                || isAmbientAudio(asset),
            getChildDescription: asset =>
                isNullOrUndefined(asset) && "scenario"
                || isScenario(asset) && "zone"
                || isZone(asset) && "station/ambient audio"
                || isStation(asset) && "connection/sign/audio/video/text/model",
            canHaveChildren: node =>
                isScenario(node.value)
                || isZone(node.value)
                || isStation(node.value),
            canParent: (parent, child) =>
                isScenario(parent.value) && isZone(child.value)
                || isZone(parent.value) && (
                    isStation(child.value)
                    || isAmbientAudio(child.value))
                || isStation(parent.value) && (
                    isVoiceOver(child.value)
                    || isVideo(child.value)
                    || isSign(child.value)
                    || isText(child.value)
                    || isModel(child.value)
                    || isConnection(child.value))
        },
            ...styleProps);
    }


    getAssetName(asset: Asset): string {
        const kind = getAssetKind(asset);

        if (isNullOrUndefined(kind)) {
            return null;
        }

        let name = "";

        if (isScenario(asset)) {
            name += asset.name;
        }
        else if (isZone(asset)) {
            name += asset || "Default";

            if (asset === "") {
                name += lockedWithKey.emojiStyle;
            }
        }
        else if (isStation(asset)
            || isAmbientAudio(asset)
            || isSign(asset)
            || isAudio(asset)
            || isVideo(asset)
            || isText(asset)
            || isModel(asset)) {
            name += asset.fileName;
        }
        else if (isConnection(asset)) {
            if (asset.label && asset.label !== " ⬆︎︎ ") {
                name += asset.label;
            }
            else if (this.scenario) {
                const station = this.scenario.getStation(asset.toStationID);
                if (station) {
                    name += station.fileName;
                }
                else {
                    name += "XXX BROKEN CONNECTION XXX"
                }
            }
        }

        return name;
    }

    get scenario() {
        return this._scenario;
    }

    set scenario(v) {
        if (v !== this.scenario) {
            this.clear();
            this._scenario = v;

            // readonly needs to be set before building the tree because it
            // impacts whether tree view items are draggable.
            this.readonly = !this.scenario || this.scenario.published;

            if (isDefined(this.scenario)) {
                const values = [
                    this.scenario,
                    ...this.scenario.zones.map(z => z || ""),
                    ...this.scenario.stations,
                    ...this.scenario.audios,
                    ...this.scenario.videos,
                    ...this.scenario.texts,
                    ...this.scenario.signs,
                    ...this.scenario.models,
                    ...this.scenario.connections
                ];

                if (this.scenario.zones.length === 0) {
                    arrayInsertAt(values, "", 0);
                }
                const root = buildTree(
                    values,
                    v => this.getAssetParent(v),
                    v => this.getAssetOrder(v))
                    .children[0];
                root.removeFromParent();
                this.rootNode = root;
                this.expandAll(1);
            }
        }
    }

    private getAssetParent(asset: Asset): Asset {
        if (isNullOrUndefined(asset) || isScenario(asset)) {
            return null;
        }
        else if (isZone(asset)) {
            return this.scenario;
        }
        else if (isStation(asset) || isAmbientAudio(asset)) {
            return asset.zone;
        }
        else {
            const transform = this.scenario.getTransform(asset.transformID);
            return this.scenario.findStation(transform);
        }
    }

    private getAssetOrder(asset: Asset): number {
        return isScenario(asset) && -1
            || isZone(asset) && (asset === "" ? 0 : 1)
            || isStation(asset) && (this.isStartStation(asset) ? 2 : 3)
            || isAmbientAudio(asset) && 4
            || isVoiceOver(asset) && 5
            || isSign(asset) && 6
            || isVideo(asset) && 7
            || isText(asset) && 8
            || isModel(asset) && 9;
    }

    private isStartStation(asset: Asset): asset is Station {
        return isStation(asset)
            && isDefined(this.scenario)
            && this.scenario.startStationID === asset.transformID;
    }
}