import { Loader as GMapsLoader } from "@googlemaps/js-api-loader";
import { ClassList, ClassName, ID, PlaceHolder, Title_attr } from "@juniper-lib/dom/dist/attrs";
import { CanvasTypes, canvasToBlob, isCanvas } from "@juniper-lib/dom/dist/canvas";
import { height, padding, perc, px, width } from "@juniper-lib/dom/dist/css";
import { makeEnterKeyEventHandler, onClick, onInput, onKeyUp } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimarySmall, ButtonSecondarySmall, Div, FAIcon, InputText, Run, buttonSetEnabled, elementSetClass, elementSetText } from "@juniper-lib/dom/dist/tags";
import { TypedEvent } from "@juniper-lib/events/dist/TypedEventTarget";
import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { ILatLngPoint } from "@juniper-lib/gis/dist/LatLngPoint";
import { PlacesAsync } from "@juniper-lib/google-maps/dist/PlacesAsync";
import { StreetViewAsync } from "@juniper-lib/google-maps/dist/StreetViewAsync";
import { g2y, y2g } from "@juniper-lib/google-maps/dist/conversion";
import { Image_Jpeg, Image_Png } from "@juniper-lib/mediatypes/dist";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { PhotosphereCaptureResolution } from "@juniper-lib/threejs/dist/PhotosphereRig";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { blobToObjectURL } from "@juniper-lib/tslib/dist/blobToObjectURL";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { toBytes } from "@juniper-lib/tslib/dist/units/fileSize";
import { GroupPanel } from "@juniper-lib/widgets/dist/GroupPanel";
import { Image_Vendor_Google_StreetView_Pano, PhotosphereMetadata } from "../../../vr-apps/yarrow/data";
import { EditableScenario } from "../EditableScenario";
import { GSVMetadata } from "../GSVMetadata";
import { PlaceResultsDialog } from "../PlaceResultsDialog";
import { BaseEditorView } from "./BaseEditorView";

export interface IMapView {
    setTarget(v: ILatLngPoint): void;
    createMarker(location: ILatLngPoint, label: string, icon: string | URL | CanvasTypes): Promise<google.maps.Marker>;
    createOverlay(location: ILatLngPoint, width: number, height: number, image: string | URL | CanvasTypes): Promise<google.maps.GroundOverlay>;
    createLine(path: ReadonlyArray<ILatLngPoint>): google.maps.Polyline;
    getElevation(latLng: ILatLngPoint): Promise<number>;
    getCenter(): Promise<ILatLngPoint>;
    loadMetadataForFile(fileID: number): Promise<void>;
    getMetadataForFile(fileID: number): Promise<PhotosphereMetadata>;
    setMetadata(metadata: PhotosphereMetadata): Promise<void>;
}

const MAX_IMAGE_SIZE = toBytes(9, "MiB");

export class StreetViewCaptureStartEvent extends TypedEvent<"capturestart"> {
    constructor() {
        super("capturestart");
    }
}

export class StreetViewCaptureCompleteEvent
    extends TypedEvent<"capturecomplete"> {
    constructor(public readonly metadata: PhotosphereMetadata) {
        super("capturecomplete");
    }
}

type MapViewEvents = {
    "capturestart": StreetViewCaptureStartEvent;
    "capturecomplete": StreetViewCaptureCompleteEvent;
    "streetviewopened": TypedEvent<"streetviewopened">;
}

export class MapView
    extends BaseEditorView<MapViewEvents>
    implements IMapView {

    private readonly resultsDialog = new PlaceResultsDialog();
    private readonly searchBox: HTMLInputElement;
    private readonly searchButton: HTMLButtonElement;
    private readonly toggleMarkersButton: HTMLButtonElement;
    private readonly mapContainer: HTMLDivElement;
    private readonly addButton: HTMLButtonElement;
    private readonly captureButton: HTMLButtonElement;
    private readonly sphereNameInput: HTMLInputElement;
    private readonly copyrightLabel: HTMLElement;
    private readonly files: GSVMetadata;

    private map: google.maps.Map = null;
    private elevation: google.maps.ElevationService = null;
    private places: PlacesAsync = null;
    private targetMarker: google.maps.Marker = null;
    private markersVisible = true;
    private _scenario: EditableScenario = null;
    private _metadata: PhotosphereMetadata = null;
    private streetView: StreetViewAsync = null;

    constructor(private readonly fetcher: IFetcher, private readonly streetViewContainer: HTMLDivElement, private readonly env: Environment) {

        super();

        this.files = new GSVMetadata(this.fetcher);

        this._element = Div(
            ClassName("map"),
            width(perc(100)),
            height(perc(100)),

            new GroupPanel(
                this.searchBox = InputText(
                    ID("mapSearch"),
                    ClassList("form-control"),
                    PlaceHolder("Search map and Street View"),
                    onKeyUp(makeEnterKeyEventHandler(() =>
                        this.search(this.searchBox.value, true))),
                    onInput(() =>
                        this.searchButton.disabled = this.searchBox.value.length === 0)
                ),

                this.searchButton = ButtonPrimarySmall(
                    FAIcon("search-location"),
                    Title_attr("Search"),
                    onClick(() =>
                        this.search(this.searchBox.value, true))
                ),

                this.toggleMarkersButton = ButtonSecondarySmall(
                    "Hide Labels",
                    onClick(() => {
                        this.markersVisible = !this.markersVisible;
                        elementSetText(this.toggleMarkersButton, this.markersVisible ? "Hide Labels" : "Show Labels");
                        this.scenario.toggleMarkers();
                    })
                )
            ),

            new GroupPanel(
                this.sphereNameInput = InputText(
                    ID("sphereName"),
                    ClassList("form-control"),
                    PlaceHolder("Enter station name"),
                    onInput(() => this.refresh())
                ),

                this.copyrightLabel = Run(
                    ID("streetViewCopyright"),
                    padding(px(5))
                ),

                this.addButton = ButtonPrimarySmall(
                    "Add",
                    onClick(() => this.addStreetView())
                ),

                this.captureButton = ButtonPrimarySmall(
                    ID("streetViewCaptureButton"),
                    "Capture",
                    onClick(() => this.captureStreetView(false))
                )
            ),

            this.mapContainer = Div(
                ClassName("detail"),
                ID("mapView")
            )
        );

        Object.seal(this);
    }

    get zoom(): number {
        return this.map
            && this.map.getZoom();
    }

    set zoom(v: number) {
        if (this.map) {
            this.map.setZoom(v);
        }
    }

    async getCenter(): Promise<ILatLngPoint> {
        if (isNullOrUndefined(this.map)) {
            return undefined;
        }

        const center = g2y(this.map.getCenter());

        if (isDefined(center)) {
            center.alt = await this.getElevation(center);
        }

        return center;
    }

    async getElevation(latLng: ILatLngPoint): Promise<number> {
        const response = await this.elevation.getElevationForLocations({
            locations: [y2g(latLng)]
        });

        if (response.results.length > 0) {
            return response.results[0].elevation;
        }
        else {
            return 0;
        }
    }

    setTarget(v: ILatLngPoint) {
        if (this.map && this.targetMarker) {
            if (v) {
                const u = y2g(v);
                this.targetMarker.setMap(this.map);
                this.targetMarker.setPosition(u);
                this.panTo(u);
            }
            else {
                this.targetMarker.setMap(null);
            }
        }
    }

    panTo(v: google.maps.LatLng): void;
    panTo(v: google.maps.LatLngLiteral): void;
    panTo(v: ILatLngPoint): void;
    panTo(v: ILatLngPoint | google.maps.LatLng | google.maps.LatLngLiteral): void {
        if (this.map) {
            if (v instanceof google.maps.LatLng) {
                v = g2y(v);
            }

            this.map.panTo(v);
        }
    }

    fitBounds(...points: ILatLngPoint[]) {
        const bounds = new google.maps.LatLngBounds();
        points
            .map(y2g)
            .forEach(p => bounds.extend(p));

        this.map.fitBounds(bounds);
    }

    async load(prog?: IProgress): Promise<void> {
        if (prog) {
            prog.start();
        }

        const apiKey = await this.fetcher
            .get("/Editor/Google/APIKey/")
            .object<string>()
            .then(unwrapResponse);

        const gmapsLoader = new GMapsLoader({
            apiKey,
            version: "weekly",
            libraries: [
                "drawing",
                "places"
            ]
        });

        await gmapsLoader.load();

        this.map = new google.maps.Map(this.mapContainer, {
            zoom: 12,
            streetView: new google.maps.StreetViewPanorama(this.streetViewContainer, {
                addressControl: false,
                clickToGo: true,
                fullscreenControl: true,
                motionTracking: false
            })
        });

        this.elevation = new google.maps.ElevationService();

        this.streetView = new StreetViewAsync(this.map.getStreetView());
        this.streetView.addEventListener("positionchanged", () => {
            this.search(this.streetView.getPano(), false);
        });

        this.places = new PlacesAsync(new google.maps.places.PlacesService(this.map));

        this.targetMarker = new google.maps.Marker({
            icon: {
                url: "/images/markers/up-arrow.png",
                size: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 0)
            },
            clickable: false,
            draggable: false,
            optimized: false
        });

        if (prog) {
            prog.end();
        }
    }

    closeStreetView() {
        this.streetView.close();
    }

    async search(query: string, showError: boolean): Promise<void> {
        if (this.map && this.places && this.streetView) {
            this.enabled = false;

            try {
                const m = await this.files.searchGSV(query)
                    .then(unwrapResponse)
                    || await this.files.requestGSV(query)
                        .then(unwrapResponse);

                if (isDefined(m) && m.status !== "ZERO_RESULTS") {
                    await this.setMetadata(m);
                }
                else {
                    const results = await this.places.textSearch({
                        query,
                        bounds: this.map.getBounds()
                    });

                    const result = await this.selectResult(results);

                    if (result) {
                        this.setTarget(g2y(result.geometry.location));
                    }
                    else {
                        throw "No results";
                    }
                }
            }
            catch (status) {
                const error = `ERROR: ${status}`;
                if (showError) {
                    this.searchBox.value = error;
                }
            }

            this.enabled = true;
        }
    }

    private async selectResult(results: google.maps.places.PlaceResult[]): Promise<google.maps.places.PlaceResult> {
        if (results.length === 0) {
            return null;
        }
        else if (results.length === 1) {
            return results[0];
        }

        return await this.resultsDialog.selectResult(results);
    }

    async createOverlay(location: ILatLngPoint, width: number, height: number, image: string | URL | CanvasTypes): Promise<google.maps.GroundOverlay> {
        if (isCanvas(image)) {
            const blob = await canvasToBlob(image, Image_Png);
            image = blobToObjectURL(blob);
        }

        if (image instanceof URL) {
            image = image.href;
        }

        const center = new google.maps.LatLng(y2g(location));
        const north = google.maps.geometry.spherical.computeOffset(center, height, 0);
        const east = google.maps.geometry.spherical.computeOffset(center, width, 90);
        const south = google.maps.geometry.spherical.computeOffset(center, height, 180);
        const west = google.maps.geometry.spherical.computeOffset(center, width, 270);

        const bounds = {
            north: north.lat(),
            east: east.lng(),
            south: south.lat(),
            west: west.lng()
        };

        return new google.maps.GroundOverlay(image, bounds, {
            map: this.map
        });
    }

    async createMarker(location: ILatLngPoint, label: string, icon: string | URL | CanvasTypes): Promise<google.maps.Marker> {
        if (isCanvas(icon)) {
            const blob = await canvasToBlob(icon, Image_Png);
            icon = blobToObjectURL(blob);
        }

        if (icon instanceof URL) {
            icon = icon.href;
        }

        const opts: google.maps.MarkerOptions = {
            map: this.map,
            position: y2g(location),
            label,
            icon
        };

        return new google.maps.Marker(opts);
    }

    createLine(path: ReadonlyArray<ILatLngPoint>) {
        return new google.maps.Polyline({
            map: this.map,
            path: path.map(y2g),
            geodesic: true,
            strokeColor: "red",
            strokeOpacity: 1,
            strokeWeight: 2
        });
    }

    async loadMetadataForFile(fileID: number): Promise<void> {
        await this.setMetadata(await this.getMetadataForFile(fileID));
    }

    getMetadataForFile(fileID: number): Promise<PhotosphereMetadata> {
        return this.files.getGSV(fileID)
            .then(unwrapResponse);
    }

    get pano(): string {
        return this.metadata && this.metadata.pano_id || null;
    }

    get hasPano(): boolean {
        return this.pano
            && this.pano.length > 0;
    }

    private get metadata() {
        return this._metadata;
    }

    async setMetadata(v: PhotosphereMetadata) {
        if (v !== this.metadata) {
            this._metadata = v;
            await this.streetView.setPano(this.pano);
            this.dispatchEvent(new TypedEvent("streetviewopened"));
            const gsvLocation = this.hasPano
                && this.streetView.getLocation();
            const description = gsvLocation
                && (gsvLocation.shortDescription
                    || gsvLocation.description);

            const fileName = v
                && v.fileName;
            this.sphereName = description
                || fileName
                || null;

            this.searchBox.value = this.hasPano
                ? this.metadata.pano_id
                : "";

            let dateString = "";
            if (this.hasMetadata) {
                const date = new Date(this.metadata.date);
                dateString = `${this.metadata.copyright}, ${date.toLocaleDateString()}`;
            }
            elementSetText(
                this.copyrightLabel,
                dateString);

            this.refresh();
        }
    }

    get scenario(): EditableScenario {
        return this._scenario;
    }

    set scenario(v: EditableScenario) {
        this._scenario = v;
        this.refresh();
    }

    get hasScenario() {
        return isDefined(this.scenario);
    }

    get sphereName(): string {
        return this.sphereNameInput.value;
    }

    set sphereName(v: string) {
        if (v !== this.sphereName) {
            this.sphereNameInput.value = v;
            this.refresh();
        }
    }

    override get enabled() {
        return super.enabled
            && this.hasScenario
            && !this.scenario.published
    }

    override set enabled(v) {
        super.enabled = v;
    }

    private get canCapture(): boolean {
        return this.enabled
            && this.hasPano
            && this.sphereNameInput.value.length > 0;
    }

    private get hasMetadata(): boolean {
        return isDefined(this.metadata);
    }

    private get isCaptured(): boolean {
        return this.hasMetadata
            && this.metadata.fileID > 0;
    }

    private get canAdd(): boolean {
        return this.enabled
            && this.isCaptured
            && this.scenario.stations.filter((s) =>
                s.fileID === this.metadata.fileID)
                .length === 0;

    }

    private get canSetName(): boolean {
        return this.enabled
            && this.hasPano
            && !this.isCaptured;
    }

    private addStreetView() {
        if (this.canAdd) {
            this.dispatchEvent(new StreetViewCaptureCompleteEvent(this.metadata));
        }
    }

    private async captureStreetView(saveAsLink: boolean) {
        if (this.canCapture) {
            this.dispatchEvent(new StreetViewCaptureStartEvent());

            await this.env.withFade(async () => {

                let progUpload: IProgress;
                let blob: Blob;
                if (saveAsLink) {
                    blob = new Blob([this.pano], {
                        type: Image_Vendor_Google_StreetView_Pano.value
                    });
                    progUpload = this.env.loadingBar;
                }
                else {

                    const [capture, encode, upload] = progressSplitWeighted(this.env.loadingBar, [15, 1, 5]);
                    progUpload = upload;

                    const canv = await this.scenario.rig.loadCanvas(this.pano, PhotosphereCaptureResolution.High, capture);

                    for (let quality = 1; quality >= 0.5; quality -= 0.05) {
                        encode.report(2 * (1 - quality), 1, "encoding");
                        blob = await canvasToBlob(canv, Image_Jpeg, quality);
                        if (blob.size <= MAX_IMAGE_SIZE) {
                            break;
                        }
                    }
                    encode.end("encoding");
                }

                const save = this.isCaptured
                    ? this.files.replaceGSV.bind(this.files, this.metadata.fileID)
                    : this.files.uploadGSV.bind(this.files);

                this.metadata.fileName = this.sphereName;
                this.metadata.fileID = await save(
                    blob,
                    this.metadata.fileName,
                    this.metadata.pano_id,
                    this.metadata.location.lat,
                    this.metadata.location.lng,
                    this.metadata.copyright,
                    this.metadata.date,
                    progUpload)
                    .then(unwrapResponse);
                this.metadata.filePath = `/vr/file/${this.metadata.fileID.toFixed(0)}`;

                this.scenario.clearCache();

                this.env.loadingBar.end("done");
            });

            this.dispatchEvent(new StreetViewCaptureCompleteEvent(this.metadata));
        }
    }

    protected onRefresh(): void {
        this.searchButton.disabled = this.disabled
            || this.searchBox.value.length === 0;

        this.searchBox.disabled = this.disabled;

        this.sphereNameInput.disabled = !this.canSetName;

        this.addButton.disabled = !this.canAdd;

        elementSetClass(this.captureButton, this.isCaptured, "btn-danger");
        elementSetClass(this.captureButton, !this.isCaptured, "btn-primary");

        buttonSetEnabled(
            this.captureButton,
            this.canCapture,
            this.isCaptured ? "Recapture" : "Capture",
            this.isCaptured ? "Download photosphere again and replace it" : "Download photosphere");
    }
}
