import { autoComplete, classList, className, customData, max, min, placeHolder, step, wrap } from "@juniper-lib/dom/attrs";
import { em, maxWidth, overflow, textOverflow, whiteSpace } from "@juniper-lib/dom/css";
import { onClick, onInput } from "@juniper-lib/dom/evts";
import { ButtonPrimarySmall, Div, elementInsertBefore, elementSetText, elementSetTitle, InputNumber, Run, TextArea } from "@juniper-lib/dom/tags";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { TransformMode } from "@juniper-lib/threejs/TransformEditor";
import { TypedEvent } from "@juniper-lib/events/EventBase";
import { LatLngPoint } from "@juniper-lib/gis/LatLngPoint";
import { deg2rad, formatNumber, parseNumber, rad2deg } from "@juniper-lib/tslib/math";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { meters2Millimeters, millimeters2Meters } from "@juniper-lib/tslib/units/length";
import { GroupPanel } from "@juniper-lib/widgets/GroupPanel";
import { InputRangeWithNumber } from "@juniper-lib/widgets/InputRangeWithNumber";
import { group } from "@juniper-lib/widgets/PropertyList";
import { Euler, Object3D, Quaternion } from "three";
import { FilePicker } from "../../../file-picker/FilePicker";
import type { FileData, PhotosphereMetadata, Zone } from "../../../vr-apps/yarrow/data";
import { Station } from "../../../vr-apps/yarrow/Station";
import { EditableScenario } from "../EditableScenario";
import { Asset, isZone } from "../models";
import { IMapView } from "../views/MapView";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class StationViewEvent<T extends string> extends TypedEvent<T> {
    constructor(type: T, public readonly station: Station) {
        super(type);
    }
}

export class StationViewMarkStartEvent extends StationViewEvent<"stationmarkstart">{
    constructor(station: Station) {
        super("stationmarkstart", station);
    }
}

export class StationCreateConnectionEvent extends StationViewEvent<"createconnection"> {
    constructor(station: Station) {
        super("createconnection", station);
    }
}

interface StationDetailViewEvents {
    stationmarkstart: StationViewMarkStartEvent;
    createconnection: StationCreateConnectionEvent;
}

const GOOGLE_METADATA = "googleMetadataGroup";
const START_STATION_ROTATION = "startStationRotationGroup";

export class StationView
    extends BaseScenarioFileObjectView<StationDetailViewEvents, Station, Zone> {

    private readonly markStartButton: HTMLButtonElement;
    private readonly elevationInput: HTMLInputElement;
    private readonly googlePanoIDBox: HTMLDivElement;
    private readonly latitudeBox: HTMLDivElement;
    private readonly longitudeBox: HTMLDivElement;
    private readonly viewStreetViewButton: HTMLButtonElement;
    private readonly connectButton: HTMLButtonElement;

    private readonly startRotationBox: InputRangeWithNumber;
    private readonly rotationXInput: InputRangeWithNumber;
    private readonly rotationYInput: InputRangeWithNumber;
    private readonly rotationZInput: InputRangeWithNumber;
    private readonly labelInput: HTMLTextAreaElement;

    readonly stationTransformDummy = new Object3D();

    private _metadata: PhotosphereMetadata = null;

    constructor(filePicker: FilePicker, private readonly mapView: IMapView) {
        super(
            "Station",
            "Reset",
            filePicker,
            [
                Image_Jpeg
            ],
            [
                "photosphere"
            ],
            [
                "Avoid crowded areas",
                "Avoid photospheres with objects in arms-reach"
            ]);

        const rotationSaver = () => {
            this.stationTransformDummy.quaternion.copy(this.rotationQuat);
            this.saveRotation();
        };

        this.addProperties(
            group(GOOGLE_METADATA,
                ["Google Pano ID",
                    new GroupPanel(
                        this.googlePanoIDBox = Run(
                            overflow("hidden"),
                            whiteSpace("nowrap"),
                            textOverflow("ellipsis"),
                            maxWidth(em(10))
                        ),
                        this.viewStreetViewButton = ButtonPrimarySmall(
                            "View",
                            onClick(() => {
                                this.mapView.setMetadata(this.metadata);
                            })
                        )
                    )
                ]
            ),

            group(START_STATION_ROTATION,
                ["Start rotation",
                    this.startRotationBox = new InputRangeWithNumber(
                        classList("form-control"),
                        min(0),
                        max(360),
                        step(0.1),
                        placeHolder("degrees"),
                        onInput(() => {
                            if (this.isStartStation) {
                                this.scenario.stationAdapter.setStartRotation(this.value, deg2rad(this.startRotationBox.valueAsNumber));
                                this.scenario.env.avatar.setHeadingImmediate(this.scenario.startRotation);
                            }
                        })
                    )
                ]
            ),

            ["Label",
                this.labelInput = TextArea(
                    classList("form-control"),
                    placeHolder("Enter label"),
                    wrap("soft"),
                    autoComplete(false),
                    customData("lpignore", "true"),
                    onInput(() =>
                        this.scenario.stationAdapter.updateThrottled(this.value, {
                            label: this.label
                        }))
                )
            ],

            ["Latitude",
                this.latitudeBox = Run()
            ],

            ["Longitude",
                this.longitudeBox = Run()
            ],

            ["Elevation",
                new GroupPanel(
                    this.elevationInput = InputNumber(
                        "Reset",
                        classList("form-control"),
                        onInput(() => this.scenario.stationAdapter.moveThrottled(this.value, this.value.location.lat, this.value.location.lng, this.elevation, false)),
                        placeHolder("Elevation"),
                        step(0.001)
                    ),
                    this.resetButton
                )
            ],

            ["Pitch",
                this.rotationXInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotationSaver)
                )
            ],

            ["Yaw",
                this.rotationYInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotationSaver)
                )
            ],

            ["Roll",
                this.rotationZInput = new InputRangeWithNumber(
                    classList("form-control"),
                    min(-180),
                    max(180),
                    step(0.1),
                    onInput(rotationSaver)
                )
            ]
        );

        elementInsertBefore(
            this.element,
            Div(
                className("controls"),
                this.markStartButton = ButtonPrimarySmall(
                    "Mark Start",
                    onClick(() => this.dispatchEvent(new StationViewMarkStartEvent(this.value)))
                ),
                this.connectButton = ButtonPrimarySmall(
                    "Connect",
                    onClick(() => this.dispatchEvent(new StationCreateConnectionEvent(this.value)))
                )
            ),
            this.scrollPanel
        );

        Object.seal(this);

        this.refreshValues();
    }

    updateRotationFromTransformer() {
        this.rotationQuat
            = this.scenario.env.skybox.rotation
            = this.stationTransformDummy.quaternion;
    }

    saveRotation() {
        this.scenario.stationAdapter.updateThrottled(this.value, { rotation: this.rotationArray });
    }

    override getTransformModes(): TransformMode[] {
        return [
            TransformMode.RotateViewSpace,
            TransformMode.RotateGlobalSpace,
            TransformMode.RotateObjectSpace
        ];
    }

    protected override onScenarioChanged(oldScenario: EditableScenario) {
        if (isDefined(oldScenario)) {
            this.stationTransformDummy.removeFromParent();
            oldScenario.removeScope(this);
        }

        if (isDefined(this.scenario)) {
            this.scenario.env.worldUISpace.add(this.stationTransformDummy);
            this.stationTransformDummy.position.z = -3;

            this.scenario.addScopedEventListener(this, "stationmarkermoved", async (evt) => {
                const elevation = await this.mapView.getElevation(evt.latLng);
                await this.scenario.stationAdapter.move(
                    evt.station,
                    evt.latLng.lat,
                    evt.latLng.lng,
                    elevation,
                    false);
                if (evt.station === this.value) {
                    this.refreshValues();
                }
            });
        }
    }

    protected getValueName(value: Station) {
        return value.fileName;
    }

    renameValue(value: Station, newName: string): void {
        this.scenario.stationAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Station) {
        const elevation = await this.mapView.getElevation(value.location);
        await this.scenario.stationAdapter.move(value, value.location.lat, value.location.lng, elevation, true);
    }

    deleteValue(value: Station): Promise<void> {
        return this.scenario.stationAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Zone {
        return isZone(parent);
    }

    protected async onFileSelection(parent: Zone, file: FileData, prog?: IProgress): Promise<Station> {
        const target = await this.mapView.getCenter();
        await this.scenario.resolveOrigin(target);
        const value = await this.scenario.stationAdapter.create(file.id, file.name, target.lat, target.lng, target.alt, prog);
        await this.scenario.stationAdapter.update(value, { zone: parent });
        return value;
    }

    get metadata(): PhotosphereMetadata {
        return this._metadata;
    }

    set metadata(v: PhotosphereMetadata) {
        if (v !== this.metadata) {
            this._metadata = v;
            this.refresh();
        }
    }

    get hasMetadata() {
        return isDefined(this.metadata);
    }

    get label(): string {
        if (this.hasValue) {
            return this.labelInput.value;
        }
        else {
            return null;
        }
    }

    set label(v: string) {
        this.labelInput.value = v;
    }

    get elevation(): number {
        if (this.hasValue) {
            return this.elevationInput.valueAsNumber;
        }
        else {
            return null;
        }
    }

    set elevation(v: number) {
        if (isDefined(v)) {
            v = millimeters2Meters(Math.round(meters2Millimeters(v)));
        }

        if (v !== this.elevation) {
            this.elevationInput.valueAsNumber = v;
        }
    }

    get rotationEuler(): Euler {
        return new Euler()
            .set(deg2rad(this.rotationX),
                deg2rad(this.rotationY),
                deg2rad(this.rotationZ),
                "XYZ");
    }

    set rotationEuler(euler: Euler) {
        this.rotationX = rad2deg(euler.x);
        this.rotationY = rad2deg(euler.y);
        this.rotationZ = rad2deg(euler.z);
    }

    get rotationQuat(): Quaternion {
        return new Quaternion().setFromEuler(this.rotationEuler);
    }

    set rotationQuat(v: Quaternion) {
        this.rotationEuler = new Euler().setFromQuaternion(v);
    }

    get rotationArray(): number[] {
        return this.rotationQuat.toArray();
    }

    set rotationArray(v: number[]) {
        this.rotationQuat = new Quaternion().fromArray(v);
    }

    get rotationX(): number {
        return parseNumber(this.rotationXInput.value);
    }

    set rotationX(v: number) {
        this.rotationXInput.value = formatNumber(v);
    }

    get rotationY(): number {
        return parseNumber(this.rotationYInput.value);
    }

    set rotationY(v: number) {
        this.rotationYInput.value = formatNumber(v);
    }

    get rotationZ(): number {
        return parseNumber(this.rotationZInput.value);
    }

    set rotationZ(v: number) {
        this.rotationZInput.value = formatNumber(v);
    }

    private get isStartStation(): boolean {
        return this.hasScenario
            && this.hasValue
            && this.scenario.startStation === this.value;
    }

    private get canMarkStartStation(): boolean {
        return this.canEdit
            && !this.isStartStation;
    }

    protected override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            const [lat, lng] = new LatLngPoint(this.value.location).toDMSArray(2);
            elementSetText(this.latitudeBox, lat);
            elementSetText(this.longitudeBox, lng);
            this.label = this.value.label;
            this.elevation = this.value.location.alt;
            this.rotationArray = this.value.rotation;
            this.mapView.getMetadataForFile(this.value.fileID)
                .then(m => this.metadata = m);
        }
        else {
            elementSetText(this.latitudeBox, "N/A");
            elementSetText(this.longitudeBox, "N/A");
            this.label = null;
            this.elevation = null;
            this.rotationX = null;
            this.rotationY = null;
            this.rotationZ = null;
            this.metadata = null;
        }
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.properties.setGroupVisible(GOOGLE_METADATA, this.hasMetadata);

        if (this.hasMetadata) {
            elementSetText(this.googlePanoIDBox, this.metadata.pano_id);
            elementSetTitle(this.googlePanoIDBox, this.metadata.pano_id);
        }

        this.properties.setGroupVisible(START_STATION_ROTATION, this.isStartStation);
        if (this.isStartStation) {
            this.startRotationBox.value = formatNumber(rad2deg(this.scenario.startRotation), 1);
        }

        this.markStartButton.disabled = !this.canMarkStartStation;

        this.viewStreetViewButton.disabled
            = this.startRotationBox.disabled
            = this.labelInput.disabled
            = this.elevationInput.disabled
            = this.rotationXInput.disabled
            = this.rotationYInput.disabled
            = this.rotationZInput.disabled
            = this.connectButton.disabled
            = !this.canEdit;
    }
}
