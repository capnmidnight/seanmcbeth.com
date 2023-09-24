import { TreeNode } from "@juniper-lib/collections/dist/TreeNode";
import { ClassList, CustomData, ID } from "@juniper-lib/dom/dist/attrs";
import { color, overflow } from "@juniper-lib/dom/dist/css";
import { Canvas, Div, ErsatzElement, HR, HtmlRender, Span } from "@juniper-lib/dom/dist/tags";
import { warning } from "@juniper-lib/emoji/dist";
import { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { y2g } from "@juniper-lib/google/dist-maps/conversion";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { TransformEditor } from "@juniper-lib/threejs/dist/TransformEditor";
import { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { widgetRemoveFromParent } from "@juniper-lib/threejs/dist/widgets/widgets";
import { IDataLogger } from "@juniper-lib/tslib/dist/IDataLogger";
import { URLBuilder } from "@juniper-lib/tslib/dist/URLBuilder";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { ContextMenu } from "@juniper-lib/widgets/dist/ContextMenu";
import { DockCell, DockGroupColumn, DockGroupRow, DockPanel, rearrangeable, resizable } from "@juniper-lib/widgets/dist/DockPanel";
import { TabPanel, TabPanelElement } from "@juniper-lib/widgets/dist/TabPanel";
import { TreeViewNodeEvent } from "@juniper-lib/widgets/dist/TreeView/TreeViewNode";
import { FilePicker } from "../../file-picker/FilePicker";
import {
    BasicLabelColor,
    DLSBlue,
    defaultFont,
    enableFullResolution,
    getAppScriptUrl,
    getUIImagePaths
} from "../../settings";
import { Transform } from "../../vr-apps/yarrow/Transform";
import { EditableScenario } from "../editor/EditableScenario";
import { AssetEditableScenario } from "./AssetEditableScenario";
import { AssetList } from "./AssetList";
import { FileDetailDialog } from "./FileDetailDialog";
import { Asset, AssetDeleteEvent, AssetKind, AssetRenameEvent, AssetResetEvent, AssetViewFileEvent, DeletableAsset, DeletableAssetKind, FileAsset, FileAssetEvents, FileAssetKind, ResetableAsset, ResetableAssetEvents, ResetableAssetKind, assetDisplayNames, assetNames, getAssetKind, isAmbientAudio, isConnection, isScenario, isStation, isZone } from "./models";
import { AudiosView } from "./views/AudiosView";
import { BaseScenarioFileObjectView } from "./views/BaseScenarioFileObjectView";
import { BaseScenarioObjectView } from "./views/BaseScenarioObjectView";
import { BaseScenarioResetableObjectView } from "./views/BaseScenarioResetableObjectView";
import { BaseScenarioView } from "./views/BaseScenarioView";
import { ConnectionsView } from "./views/ConnectionsView";
import { EnvironmentAudioView } from "./views/EnvironmentAudioView";
import { MapView } from "./views/MapView";
import { ModelsView } from "./views/ModelsView";
import { ScenarioView } from "./views/ScenarioView";
import { SignsView } from "./views/SignsView";
import { StationView } from "./views/StationView";
import { TextsView } from "./views/TextsView";
import { VideosView } from "./views/VideosView";
import { ZoneView } from "./views/ZoneView";

const scenarioIDPattern = /\/\d+\/?$/;

export class EditorView implements ErsatzElement {
    readonly element: HTMLElement;

    private readonly fileDetailDialog = new FileDetailDialog();

    private readonly env: Environment;
    private readonly transformer: TransformEditor;
    private readonly assetsList: AssetList;
    private readonly scenarioView: ScenarioView;
    private readonly stationView: StationView;
    private readonly connectionView: ConnectionsView;
    private readonly mapView: MapView;
    private readonly propertyViews: Map<AssetKind, BaseScenarioView<unknown, Asset>>;
    private readonly viewTabs: TabPanelElement<"streetview" | "appContainer">;
    private readonly contextMenu: ContextMenu;

    private _scenario: EditableScenario = null;
    private _disabled = false;

    constructor(fetcher: IFetcher, private readonly logger: IDataLogger) {

        const frontBuffer = Canvas(ID("frontBuffer"));

        const environmentView = Div(
            ID("appContainer"),
            frontBuffer
        );

        this.env = new Environment({
            canvas: frontBuffer,
            fetcher,
            dialogFontFamily: defaultFont.fontFamily,
            getAppUrl: getAppScriptUrl,
            uiImagePaths: getUIImagePaths(),
            buttonFillColor: DLSBlue,
            labelFillColor: BasicLabelColor,
            defaultFOV: 75,
            enableFullResolution,
            DEBUG: true,
            watchModelPath: "/models/watch1.glb"
        });

        this.transformer = new TransformEditor(this.env);
        this.transformer.addEventListener("moving", () => {
            if (this.transformer.target === this.stationView.stationTransformDummy) {
                this.stationView.updateRotationFromTransformer();
            }
            else if (this.transformer.target instanceof Transform) {
                const asset = this.scenario.getAssetForTransform(this.transformer.target);
                if (isDefined(asset)) {
                    const view = this.getViewFor(asset);
                    view.updateTransformView(asset);
                }
            }
        });
        this.transformer.addEventListener("moved", () => {
            if (this.transformer.target === this.stationView.stationTransformDummy) {
                this.stationView.updateRotationFromTransformer();
                this.stationView.saveRotation();
            }
            else if (this.transformer.target instanceof Transform) {
                const asset = this.scenario.getAssetForTransform(this.transformer.target);
                if (isDefined(asset)) {
                    const view = this.getViewFor(asset);
                    this.withLock(() => view.saveTransform(asset));
                }
            }
        });

        HtmlRender(this.env.subMenu,
            ...this.transformer.modeButtons
        );
        this.env.foreground.add(this.transformer.object);

        const streetViewContainer = Div(ID("streetViewPreview"));

        this.mapView = new MapView(fetcher, streetViewContainer, this.env);

        const filePicker = new FilePicker(fetcher, this.env);
        this.stationView = new StationView(filePicker, this.mapView);

        const filePropertyViews = new Map<FileAssetKind, BaseScenarioFileObjectView<FileAssetEvents, FileAsset, Asset>>([
            ["station", this.stationView],
            ["ambientAudio", new EnvironmentAudioView(filePicker, this.mapView)],
            ["audio", new AudiosView(filePicker)],
            ["video", new VideosView(filePicker)],
            ["text", new TextsView(filePicker)],
            ["sign", new SignsView(filePicker)],
            ["model", new ModelsView(filePicker)]
        ]);

        const resetablePropertyViews = new Map<ResetableAssetKind, BaseScenarioResetableObjectView<ResetableAssetEvents, ResetableAsset, Asset>>([
            ...Array.from(filePropertyViews.entries()),
            ["connection", this.connectionView = new ConnectionsView()]
        ]);

        const objPropertyViews = new Map<DeletableAssetKind, BaseScenarioObjectView<unknown, DeletableAsset, Asset>>([
            ...Array.from(resetablePropertyViews.entries()),
            ["zone", new ZoneView()]
        ]);

        this.propertyViews = new Map<AssetKind, BaseScenarioView<unknown, Asset>>([
            ...Array.from(objPropertyViews.entries()),
            ["scenario", this.scenarioView = new ScenarioView()]
        ]);

        this.scenarioView.addEventListener("loadscenario", evt =>
            this.withLock(async () => {
                this.scenario = null;
                await this.loadScenario(evt.scenarioID);
            }));

        this.scenarioView.addEventListener("forkscenario", () =>
            this.withLock(async () => {
                const scenario = this.scenario;
                this.scenario = null;
                const newScenarioID = await scenario
                    .fork()
                    .then(unwrapResponse);
                await this.loadScenario(newScenarioID);
            }));

        this.scenarioView.addEventListener("publishscenario", (evt) =>
            this.withLock(async () => {
                const scenario = this.scenario;
                this.scenario = null;
                await scenario.publish();
                await this.loadScenario(evt.scenarioID);
            }));

        const onViewAsset = (evt: AssetViewFileEvent) => {
            this.withLock(async () => {
                const asset = evt.asset;
                const view = this.getViewFor(asset);
                await this.fileDetailDialog.showFile(asset.fileID);
                await view.reloadFile();
            });
        };

        for (const view of filePropertyViews.values()) {
            view.addEventListener("assetviewfile", onViewAsset);
        }

        const onResetAsset = (evt: AssetResetEvent) => {
            this.withLock(async () => {
                const kind = getAssetKind(evt.asset);
                const view = resetablePropertyViews.get(kind);
                await view.resetValue(evt.asset);
                view.refreshValues();
            });
        };

        for (const view of resetablePropertyViews.values()) {
            view.addEventListener("assetreset", onResetAsset);
        }

        const onDeleteAsset = (evt: AssetDeleteEvent) => {
            this.deleteAsset(evt.asset);
        };

        const onRenameAsset = (evt: AssetRenameEvent) => {
            const { newName, asset: oldName } = evt;
            if (newName !== oldName) {
                const view = this.getViewFor(oldName);
                view.renameValue(oldName, newName);

                if (isZone(oldName)) {
                    const oldZoneNode = this.assetsList.findNode(oldName);
                    let newZoneNode = this.assetsList.findNode(newName);
                    if (isNullOrUndefined(newZoneNode)) {
                        this.assetsList.addValue(newName);
                        newZoneNode = this.assetsList.findNode(newName);
                    }

                    this.moveZoneChildren(oldZoneNode, newZoneNode);
                    this.assetsList.removeNode(oldZoneNode);
                }
                else {
                    const node = this.assetsList.findNode(oldName);
                    this.assetsList.updateNode(node);
                }
            }
        };

        for (const view of objPropertyViews.values()) {
            view.addEventListener("assetdelete", onDeleteAsset);
            view.addEventListener("assetrename", onRenameAsset);
        }


        HtmlRender(document.body,
            this.contextMenu = new ContextMenu());

        this.element = DockPanel(
            "Yarrow.Editor2",
            resizable(true),
            rearrangeable(true),
            ClassList("editor"),
            DockGroupRow(
                DockGroupColumn(
                    CustomData("proportion", 2),
                    DockCell(
                        "Assets",
                        this.assetsList = new AssetList()
                    ),

                    DockCell(
                        "Properties",
                        ...this.propertyViews.values()
                    )
                ),

                DockCell(
                    "Map",
                    CustomData("proportion", 3),
                    this.mapView
                ),
                DockCell(
                    Span(".", color("transparent")),
                    overflow("visible"),
                    CustomData("proportion", 6),
                    this.viewTabs = TabPanel.create(
                        ["appContainer", "Preview", environmentView],
                        ["streetview", "Google StreetView", streetViewContainer]
                    )
                )
            )
        );

        for (const view of this.propertyViews.values()) {
            view.visible = false;
        }

        this.scenarioView.visible = true;

        this.assetsList.addEventListener("select", (evt) => {
            this.selectValue(isDefined(evt.node)
                && isDefined(evt.node.value)
                ? evt.node.value
                : this.scenario);
        });

        widgetRemoveFromParent(this.env.quitButton);
        widgetRemoveFromParent(this.env.settingsButton);
        widgetRemoveFromParent(this.env.muteEnvAudioButton);

        const onMenu = async (evt: TreeViewNodeEvent<"add" | "contextmenu", Asset>) => {
            await this.onMenu(evt.parent.node, evt.type === "contextmenu");
            evt.complete();
        };

        this.assetsList.addEventListener("add", onMenu);
        this.assetsList.addEventListener("contextmenu", onMenu);
        this.assetsList.addEventListener("delete", (evt) => {
            this.deleteAsset(evt.node.value);
        });

        this.assetsList.addEventListener("reparented", (evt) => {
            if (evt.node.parent) {
                if (isZone(evt.node.parent.value)) {
                    if (isAmbientAudio(evt.node.value)) {
                        this.scenario.audioAdapter.updateThrottled(evt.node.value, { zone: evt.node.parent.value });
                    }
                    else if (isStation(evt.node.value)) {
                        this.scenario.stationAdapter.updateThrottled(evt.node.value, { zone: evt.node.parent.value });
                    }
                }
            }
        });

        this.stationView.addEventListener("stationmarkstart", (evt) => {
            this.withLock(async () => {
                const oldStart = this.scenario.startStation;
                await this.scenario.stationAdapter.markStart(evt.station);
                const oldNode = this.assetsList.findNode(oldStart);
                const newNode = this.assetsList.findNode(evt.station);
                this.assetsList.updateNode(oldNode);
                this.assetsList.updateNode(newNode);
            });
        });

        this.stationView.addEventListener("createconnection", (evt) => {
            this.withLock(() =>
                this.createAsset("connection", evt.station));
        });

        this.connectionView.addEventListener("assetselected", (evt) => {
            if (!evt.isContextMenu) {
                this.selectValue(evt.asset);
            }
        });

        this.connectionView.addEventListener("connectionstarted", (evt) => {
            this.assetsList.enabled = true;
            this.assetsList.enableOnlyValues(evt.connectables);
            this.scenario.makeOnlyStationsSelectable(evt.connectables);
        });

        this.connectionView.addEventListener("connectionending", () => {
            this.scenario.makeAllMarkersSelectable();
            this.assetsList.enableAllElements();
            this.assetsList.enabled = false;
        });

        this.mapView.addEventListener("capturestart", () => {
            this.disabled = true;
            this.viewTabs.select("appContainer");
        });

        this.mapView.addEventListener("capturecomplete", (evt) => {
            this.withLock(async () => {
                const elevation = await this.mapView.getElevation(evt.metadata.location);
                const station = await this.scenario.stationAdapter.create(
                    evt.metadata.fileID,
                    evt.metadata.fileName,
                    evt.metadata.location.lat,
                    evt.metadata.location.lng,
                    elevation);
                this.assetsList.addValue(station);
                await this.selectValue(station);
            });
        });

        this.mapView.addEventListener("streetviewopened", () => {
            this.viewTabs.select("streetview");
        });

        this.viewTabs.addEventListener("tabselected", (evt) => {
            if (evt.tabname !== "streetview") {
                this.mapView.closeStreetView();
            }
        });

        this.withLock(() => this.load());
    }

    private moveZoneChildren(oldZoneNode: TreeNode<Asset>, newZoneNode: TreeNode<Asset>) {
        for (const childNode of oldZoneNode.children) {
            this.assetsList.reparentNode(childNode, newZoneNode, 0);
        }
    }

    private deleteAsset(asset: Asset): Promise<void> {
        if (isScenario(asset)) {
            return Promise.reject("Can't delete the scenario");
        }

        return this.withLock(async () => {
            const kind = getAssetKind(asset);
            const view = this.getView(kind);
            const node = this.assetsList.findNode(asset);
            const parent = node.parent;
            const name = assetNames.get(kind);
            if (await this.env.confirmationDialog.prompt(warning.emojiStyle + " Confirm Delete", `Are you sure you want to delete ${name}: ${this.assetsList.getAssetName(asset)}`)) {
                view.value = null;

                if (isZone(asset)) {
                    const defaultZoneNode = this.assetsList.findNode("");
                    this.moveZoneChildren(node, defaultZoneNode);
                }
                else if (isStation(asset)) {
                    const backConnections = this.assetsList.findAll(value =>
                        isConnection(value)
                        && value.toStationID === asset.transformID);
                    for (const connection of backConnections) {
                        this.assetsList.removeNode(connection);
                    }
                }
                else if (isConnection(asset)) {
                    const backConnections = this.assetsList.findAll(value =>
                        isConnection(value)
                        && value.toStationID === asset.fromStationID
                        && value.fromStationID == asset.toStationID);
                    for (const connection of backConnections) {
                        this.assetsList.removeNode(connection);
                    }
                }

                const selectParent = this.assetsList.selectedNode === node;
                this.assetsList.removeNode(node);
                await view.deleteValue(asset);
                if (selectParent) {
                    await this.selectNode(parent);
                }
            }
        });
    }

    private async getSelection(parent: TreeNode<Asset>, fromContextMenu: boolean) {
        this.connectionView.cancelConnection();
        if (this.scenario.published) {
            return await this.contextMenu.show(assetDisplayNames,
                "readonly"
            );
        }
        else {
            const value = parent.value;
            if (parent.isRoot || isScenario(value)) {
                if (fromContextMenu) {
                    return await this.contextMenu.show(assetDisplayNames,
                        "zone"
                    );
                }
                else {
                    return "zone";
                }
            }
            else if (isZone(value)) {
                if (fromContextMenu && value !== "") {
                    return await this.contextMenu.show(assetDisplayNames,
                        "ambientAudio",
                        "station",
                        HR(),
                        "delete"
                    );
                }
                else {
                    return await this.contextMenu.show(assetDisplayNames,
                        "ambientAudio",
                        "station"
                    );
                }
            }
            else if (isStation(value)) {
                if (fromContextMenu) {
                    return await this.contextMenu.show(assetDisplayNames,
                        "audio",
                        "sign",
                        "video",
                        "text",
                        "model",
                        "connection",
                        HR(),
                        "delete"
                    );
                }
                else {
                    return await this.contextMenu.show(assetDisplayNames,
                        "audio",
                        "sign",
                        "video",
                        "text",
                        "model",
                        "connection"
                    );
                }
            }
            else {
                if (fromContextMenu) {
                    return await this.contextMenu.show(assetDisplayNames,
                        "delete"
                    );
                }
                else {
                    return "cancel";
                }
            }
        }
    }


    private async onMenu(node: TreeNode<Asset>, isContextMenu: boolean) {
        await this.contextMenu.cancel();
        await this.withLock(async () => {
            const selection = await this.getSelection(node, isContextMenu);
            const parent = node.value;

            if (selection === "cancel" || selection === "readonly") {
                console.warn("Cancelled");
            }
            else if (selection === "delete") {
                await this.deleteAsset(parent);
            }
            else {
                await this.createAsset(selection, parent);
            }
        });
    }

    private async createAsset(selection: DeletableAssetKind, parent: Asset) {
        if (selection === "connection") {
            await this.selectValue(parent);
        }
        const view = this.getView(selection);
        const newAsset = await view.createValue(parent, this.env.loadingBar);
        if (isDefined(newAsset)) {
            this.assetsList.addValue(newAsset);

            if (isConnection(newAsset)) {
                if (!isStation(parent)) {
                    throw new Error("Connections must be created for Stations only");
                }

                const toStation = this.scenario.getStation(newAsset.toStationID);
                const backConnection = this.scenario.connectionAdapter.findConnection(toStation, parent);
                this.assetsList.addValue(backConnection);
                await this.selectValue(toStation);
            }
            else {
                await this.selectValue(newAsset);
            }
        }
    }

    private async load(): Promise<void> {
        const pathParts = document.location.pathname.split("/");
        if (pathParts.length === 0) {
            throw new Error("Illegal path");
        }

        const scenarioIDStr = pathParts[pathParts.length - 1];
        if (!/^\d+$/.test(scenarioIDStr)) {
            throw new Error("Illegal ID");
        }

        const progs = progressSplitWeighted(this.env.loadingBar, [1, 9]);
        const scenarioID = parseFloat(scenarioIDStr);

        await this.mapView.load(progs[0]);
        await this.loadScenario(scenarioID, progs[1]);
    }

    private async loadScenario(scenarioID: number, prog?: IProgress) {
        prog = prog || this.env.loadingBar;

        const loc = new URLBuilder(location.href)
            .pathPop(scenarioIDPattern)
            .pathPush(scenarioID.toString())
            .toString();
        history.replaceState(null, null, loc);

        const scenarioAsset = new AssetEditableScenario(this.env, this.logger, this.mapView, scenarioID);
        await this.env.load(prog, scenarioAsset);

        this.scenario = scenarioAsset.result;
        this.env.menuButton.disabled = this.scenario.published;
    }

    get scenario() {
        return this._scenario;
    }

    set scenario(v) {
        const oldScenario = this.scenario;
        if (isDefined(oldScenario)) {
            oldScenario.removeScope(this);
        }

        this.assetsList.scenario
            = this.mapView.scenario
            = this._scenario
            = v;

        for (const view of this.propertyViews.values()) {
            view.scenario = v;
        }

        if (isDefined(oldScenario)) {
            oldScenario.dispose();
        }

        if (isDefined(this.scenario)) {
            this.scenario.addScopedEventListener(this, "assetselected", async (evt) => {
                if (evt.isContextMenu) {
                    const node = this.assetsList.findNode(evt.asset);
                    await this.onMenu(node, true);
                }
                else {
                    this.selectValue(evt.asset);
                }
            });

            this.scenario.addScopedEventListener(this, "assetupdated", (evt) => {
                if (evt.asset === this.assetsList.selectedValue) {
                    const view = this.getViewFor(evt.asset);
                    view.refreshValues();
                }
            });

            this.showScenario();
        }
    }

    private showScenario() {
        if (this.scenario.stations.length > 1) {
            this.mapView.fitBounds(...this.scenario.stations.map(s => s.location));
        }
        else if (isDefined(this.scenario.originLL)) {
            this.mapView.panTo(y2g(this.scenario.originLL));
        }
        else if (this.scenario.stations.length > 0) {
            this.mapView.zoom = 15;
            if (this.scenario.startStation) {
                this.mapView.panTo(this.scenario.startStation.location);
            }
            else {
                this.mapView.panTo(this.scenario.stations[0].location);
            }
        }
        else {
            this.withLock(async () => {
                await this.mapView.search(this.scenario.name, false);
            });
        }
    }

    get disabled() {
        return this._disabled;
    }

    set disabled(v) {
        this._disabled = v;
        this.mapView.disabled
            = this.assetsList.disabled
            = v;
        for (const view of this.propertyViews.values()) {
            view.disabled = v;
        }
    }

    private async withLock(action: () => Promise<void>) {
        this.disabled = true;
        try {
            await action();
        }
        finally {
            this.disabled = false;
        }
    }

    private getView(kind: FileAssetKind): BaseScenarioFileObjectView<void, FileAsset, DeletableAsset>;
    private getView(kind: ResetableAssetKind): BaseScenarioResetableObjectView<void, ResetableAsset, DeletableAsset>;
    private getView(kind: DeletableAssetKind): BaseScenarioObjectView<void, DeletableAsset, Asset>;
    private getView(kind: AssetKind): BaseScenarioView<void, Asset>
    private getView(kind: AssetKind): BaseScenarioView<void, Asset> {
        return this.propertyViews.get(kind);
    }

    private getViewFor(asset: FileAsset): BaseScenarioFileObjectView<void, FileAsset, DeletableAsset>;
    private getViewFor(asset: ResetableAsset): BaseScenarioResetableObjectView<void, ResetableAsset, DeletableAsset>;
    private getViewFor(asset: DeletableAsset): BaseScenarioObjectView<void, DeletableAsset, Asset>;
    private getViewFor(asset: Asset): BaseScenarioView<void, Asset>
    private getViewFor(asset: Asset): BaseScenarioView<void, Asset> {
        const kind = getAssetKind(asset);
        return this.getView(kind);
    }

    private async selectValue(asset: Asset) {
        const node = this.assetsList.findNode(asset);
        await this.selectNode(node);
    }

    private selecting = false;
    private async selectNode(node: TreeNode<Asset>): Promise<void> {
        if (this.connectionView.isConnecting) {
            if (isDefined(node) && isStation(node.value)) {
                this.connectionView.connectTo(node.value);
            }
        }
        else if (!this.selecting) {
            this.selecting = true;
            try {
                await this.withLock(async () => {
                    this.transformer.setTarget(null);

                    this.assetsList.selectedNode = node;

                    for (const view of this.propertyViews.values()) {
                        view.visible = false;
                    }

                    if (isDefined(node) && isDefined(node.value)) {
                        const asset = node.value;
                        const view = this.getViewFor(asset);
                        view.visible = true;
                        view.value = asset;

                        if (isScenario(asset)) {
                            this.showScenario();
                        }
                        else if (isZone(asset)) {
                            this.transformer.setTarget(null);
                            this.mapView.setTarget(null);
                        }
                        else {
                            const transform = this.scenario.getTransform(asset.transformID);

                            if (!isAmbientAudio(asset)) {
                                const station = this.scenario.findStation(transform);
                                this.viewTabs.select("appContainer");
                                this.mapView.closeStreetView();
                                await this.scenario.showStationNow(station);

                                const view = this.getViewFor(asset);
                                if (isStation(asset)) {
                                    this.stationView.stationTransformDummy.quaternion.fromArray(station.rotation);
                                    this.transformer.setTarget(this.stationView.stationTransformDummy, view.getTransformModes(asset));
                                }
                                else {
                                    this.transformer.setTarget(transform, view.getTransformModes(asset));
                                }
                            }

                            const pos = this.scenario.getTransformPosition(asset.transformID);
                            this.mapView.setTarget(pos);

                            if (!isStation(asset)) {
                                this.env.avatar.lookAt(transform);
                            }
                        }
                    }
                });
            }
            finally {
                this.selecting = false;
            }
        }
    }
}
