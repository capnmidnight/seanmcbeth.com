import { effectStore } from "@juniper-lib/audio/dist/effects";
import { ClassList, Max, Min, PlaceHolder, Step, Value } from "@juniper-lib/dom/dist/attrs";
import { Context2D, createUtilityCanvas } from "@juniper-lib/dom/dist/canvas";
import { deg, hsla, perc } from "@juniper-lib/dom/dist/css";
import { onInput } from "@juniper-lib/dom/dist/evts";
import { HtmlRender, InputCheckbox, InputNumber, Option, Run, Select, elementSetText } from "@juniper-lib/dom/dist/tags";
import { TypedEventMap } from "@juniper-lib/events/dist/TypedEventTarget";
import { LatLngPoint } from "@juniper-lib/gis/dist/LatLngPoint";
import { g2y } from "@juniper-lib/google-maps/dist/conversion";
import { Audio_Mpeg, Audio_Webm } from "@juniper-lib/mediatypes/dist";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { TransformMode } from "@juniper-lib/threejs/dist/TransformEditor";
import { Tau, formatNumber, parseNumber } from "@juniper-lib/tslib/dist/math";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { meters2Millimeters, millimeters2Meters } from "@juniper-lib/tslib/dist/units/length";
import { percent2Ratio, ratio2Percent } from "@juniper-lib/tslib/dist/units/unitless";
import { GroupPanel } from "@juniper-lib/widgets/dist/GroupPanel";
import { InputRangeWithNumber } from "@juniper-lib/widgets/dist/InputRangeWithNumber";
import { FilePicker } from "../../../file-picker/FilePicker";
import type { Audio } from "../../../vr-apps/yarrow/Audio";
import { FileData, Zone } from "../../../vr-apps/yarrow/data";
import { Asset, isZone } from "../models";
import { IMapView } from "../views/MapView";
import { BaseScenarioFileObjectView } from "./BaseScenarioFileObjectView";

export class EnvironmentAudioView
    extends BaseScenarioFileObjectView<TypedEventMap<string>, Audio, Zone> {

    private readonly volumeInput: InputRangeWithNumber;
    private readonly latitudeBox: HTMLSpanElement;
    private readonly longitudeBox: HTMLSpanElement;
    private readonly elevationInput: HTMLInputElement;
    private readonly minDistanceInput: HTMLInputElement;
    private readonly maxDistanceInput: HTMLInputElement;
    private readonly enabledInput: HTMLInputElement;
    private readonly effectInput: HTMLSelectElement;

    constructor(filePicker: FilePicker, private readonly mapView: IMapView) {
        super(
            "Environment Audio",
            "Reset",
            filePicker,
            [
                Audio_Mpeg, Audio_Webm
            ],
            [
                "ambient"
            ],
            [
                "Center the map on an empty space",
                "Upload MP3 or WEBA files"
            ]);

        const saver = () => {
            this.scenario.audioAdapter.updateThrottled(this.value, {
                enabled: this.trackEnabled,
                volume: this.volume,
                effect: this.effect,
                minDistance: this.minDistance,
                maxDistance: this.maxDistance
            });
            this.refreshOverlay();
        };

        this.addProperties(
            ["Enabled",
                this.enabledInput = InputCheckbox(
                    onInput(saver)
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
                        ClassList("form-control"),
                        onInput(() => this.scenario.audioAdapter.changeElevationThrottled(this.value, this.elevation)),
                        PlaceHolder("Elevation"),
                        Step(0.001)
                    ),
                    this.resetButton
                )
            ],

            ["Volume",
                this.volumeInput = new InputRangeWithNumber(
                    ClassList("form-control"),
                    Min(0),
                    Max(500),
                    PlaceHolder("Volume"),
                    onInput(saver)
                )
            ],

            ["Effect",
                this.effectInput = Select(
                    ClassList("custom-select"),
                    onInput(saver)
                )
            ],

            ["Min dist",
                this.minDistanceInput = InputNumber(
                    ClassList("form-control"),
                    Min(0),
                    Max(1000),
                    Step(0.01),
                    PlaceHolder("Minimum distance"),
                    onInput(saver)
                )
            ],

            ["Max dist",
                this.maxDistanceInput = InputNumber(
                    ClassList("form-control"),
                    Min(0),
                    Max(1000),
                    Step(0.01),
                    PlaceHolder("Maximum distance"),
                    onInput(saver)
                )
            ]
        );

        HtmlRender(this.effectInput,
            Option("NONE"),
            ...Array.from(effectStore
                .keys())
                .map(effectName =>
                    Option(effectName, Value(effectName))));

        Object.seal(this);

        this.refreshValues();
    }

    override getTransformModes() {
        return [
            TransformMode.MoveGlobalSpace,
            TransformMode.MoveObjectSpace,
            TransformMode.MoveViewSpace,
            TransformMode.RotateGlobalSpace,
            TransformMode.RotateObjectSpace,
            TransformMode.RotateViewSpace
        ];
    }

    override updateTransformView(value: Audio): void {
        super.updateTransformView(value);
        value.updateAudioPosition();
    }

    protected getValueName(value: Audio) {
        return value.fileName;
    }

    renameValue(value: Audio, newName: string): void {
        this.scenario.audioAdapter.updateThrottled(value, { fileName: newName });
    }

    async resetValue(value: Audio) {
        const marker = this.scenario.fileMarkers.get(value.transformID);
        const latLng = marker.getPosition();
        const elevation = await this.mapView.getElevation(g2y(latLng));
        await this.scenario.audioAdapter.changeElevation(value, elevation);
    }

    deleteValue(value: Audio): Promise<void> {
        return this.scenario.audioAdapter.delete(value);
    }

    protected validateParent(parent: Asset): parent is Zone {
        return isZone(parent);
    }

    protected async onFileSelection(parent: Zone, file: FileData, prog?: IProgress): Promise<Audio> {
        const target = await this.mapView.getCenter();
        await this.scenario.resolveOrigin(target);
        const value = await this.scenario.audioAdapter.create(null, file, prog);
        await this.scenario.audioAdapter.update(value, { zone: parent });
        const transform = this.scenario.getTransform(value.transformID);
        await this.scenario.moveTransformByGeo(transform, target.lat, target.lng, target.alt);
        this.scenario.transformAdapter.updateMarker(transform, value);
        return value;
    }

    protected override get canEdit() {
        return super.canEdit
            && isNullOrUndefined(this.value.error);
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
            if (isDefined(v)) {
                this.elevationInput.valueAsNumber = v;
            }
        }
    }

    get volume(): number {
        return percent2Ratio(this.volumeInput.valueAsNumber);
    }

    set volume(v: number) {
        this.volumeInput.valueAsNumber = Math.round(ratio2Percent(v));
    }

    get minDistance(): number {
        return parseNumber(this.minDistanceInput.value);
    }

    set minDistance(v: number) {
        this.minDistanceInput.value = formatNumber(v, 2);
    }

    get maxDistance(): number {
        return parseNumber(this.maxDistanceInput.value);
    }

    set maxDistance(v: number) {
        this.maxDistanceInput.value = formatNumber(v, 2);
    }

    get effect(): string {
        if (this.effectInput.selectedIndex === 0) {
            return null;
        }
        else {
            return this.effectInput.value;
        }
    }

    set effect(v: string) {
        if (v) {
            this.effectInput.value = v;
        }
        else {
            this.effectInput.selectedIndex = 0;
        }
    }

    get trackEnabled(): boolean | null {
        if (this.enabledInput.indeterminate) {
            return null;
        }
        else {
            return this.enabledInput.checked;
        }
    }

    set trackEnabled(v: boolean | null) {
        this.enabledInput.indeterminate = isNullOrUndefined(v);
        this.enabledInput.checked = isDefined(v) && v;
    }

    get canMove(): boolean {
        return this.canEdit && this.scenario.stations.length > 0;
    }

    private rangeOverlay: google.maps.GroundOverlay = null;

    protected override onValueChanged() {
        super.onValueChanged();

        if (this.hasValue) {
            const pos = this.scenario.getTransformPosition(this.value.transformID);
            const [lat, lng] = new LatLngPoint(pos).toDMSArray(2);
            elementSetText(this.latitudeBox, lat);
            elementSetText(this.longitudeBox, lng);
            this.elevation = pos.alt;
            this.trackEnabled = this.value.enabled;
            this.volume = this.value.volume;
            this.minDistance = this.value.minDistance;
            this.maxDistance = this.value.maxDistance;
            this.effect = this.value.effect;
        }
        else {
            elementSetText(this.latitudeBox, "N/A");
            elementSetText(this.longitudeBox, "N/A");
            this.elevation = null;
            this.trackEnabled = null;
            this.volume = null;
            this.minDistance = null;
            this.maxDistance = null;
            this.effect = null;
        }

        this.refreshOverlay();
    }

    private lock = false;
    private async refreshOverlay() {
        if (!this.lock) {
            this.lock = true;

            if (isDefined(this.rangeOverlay)) {
                this.rangeOverlay.setMap(null);
            }

            if (this.hasValue) {
                const { maxDistance, minDistance } = this.value;
                const pos = this.scenario.getTransformPosition(this.value.transformID);
                const radiusPX = 500;
                const steps = radiusPX / 5;
                const graph = createUtilityCanvas(2 * radiusPX, 2 * radiusPX);
                const radiusM = 10 * maxDistance;
                const minDistancePX = minDistance * radiusPX / radiusM;
                const maxDistancePX = maxDistance * radiusPX / radiusM;
                const context = graph.getContext("2d") as Context2D;
                const gradient = context.createRadialGradient(radiusPX, radiusPX, 0, radiusPX, radiusPX, radiusPX);
                for (let i = 0; i <= steps; ++i) {
                    const p = i / steps;
                    const dist = p * radiusM;
                    const gain = this.value.clip.spatializer.getGainAtDistance(dist);
                    const total = gain * this.value.volume;
                    const color = hsla(deg(30), perc(100), perc(50), total);
                    gradient.addColorStop(p, color);
                }

                context.fillStyle = gradient;
                context.beginPath();
                context.arc(radiusPX, radiusPX, radiusPX, 0, Tau);
                context.fill();

                context.lineWidth = 1;
                context.strokeStyle = hsla(deg(30), perc(100), perc(37.5), 1);
                context.beginPath();
                context.arc(radiusPX, radiusPX, minDistancePX, 0, Tau);
                context.stroke();

                context.lineWidth = 2;
                context.strokeStyle = hsla(deg(30), perc(100), perc(25), 1);
                context.beginPath();
                context.arc(radiusPX, radiusPX, maxDistancePX, 0, Tau);
                context.stroke();

                this.rangeOverlay = await this.mapView.createOverlay(pos, radiusM, radiusM, graph);
            }

            this.lock = false;
        }
    }

    protected override onRefresh(): void {
        super.onRefresh();

        this.volumeInput.disabled
            = this.minDistanceInput.disabled
            = this.maxDistanceInput.disabled
            = this.enabledInput.disabled
            = this.effectInput.disabled
            = !this.canEdit;

        this.elevationInput.disabled = !this.canMove;
    }
}
