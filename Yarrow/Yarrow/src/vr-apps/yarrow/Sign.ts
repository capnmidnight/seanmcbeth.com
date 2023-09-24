import { CanvasImageTypes } from "@juniper-lib/dom/dist/canvas";
import { IResponse } from "@juniper-lib/fetcher/dist/IResponse";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { PDFImage } from "@juniper-lib/graphics2d/dist/PDFImage";
import { TextImageOptions } from "@juniper-lib/graphics2d/dist/TextImage";
import { Application_Pdf } from "@juniper-lib/mediatypes/dist";
import { cleanup } from "@juniper-lib/threejs/dist/cleanup";
import { RayTarget } from "@juniper-lib/threejs/dist/eventSystem/RayTarget";
import { ErsatzObject, isErsatzObject, objGraph } from "@juniper-lib/threejs/dist/objects";
import { Image2D } from "@juniper-lib/threejs/dist/widgets/Image2D";
import { MeshButton } from "@juniper-lib/threejs/dist/widgets/MeshButton";
import { TextMesh } from "@juniper-lib/threejs/dist/widgets/TextMesh";
import { all } from "@juniper-lib/events/dist/all";
import { DwellEventer } from "@juniper-lib/events/dist/DwellEventer";
import { TypedEventBase } from "@juniper-lib/events/dist/EventBase";
import { clamp, project, rad2deg } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/dist/using";
import { FrontSide, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { DLSBlue } from "../../settings";
import { BaseScenario, PresentEvent } from "./BaseScenario";
import type { SignData } from "./data";

const TRANSITION_TIME = 1000;
const SPEED = 1000 / TRANSITION_TIME;

const Q = new Vector3();
const iconSize = 0.15;
const textSize = 0.1;
const signLabelStyle: Partial<TextImageOptions> = {
    minHeight: textSize,
    maxHeight: textSize,
    minWidth: textSize,
    padding: 0.02,
    scale: 1000,
    bgFillColor: DLSBlue,
    textFillColor: "white"
};

export class Sign
    extends Object3D
    implements IDisposable, SignData {

    image: Image2D;
    private start: number;
    private end: number;
    private t: number;
    private direction: number;

    readonly key: number;
    readonly scenarioID: number;
    readonly fileID: number;
    fileName: string;
    readonly filePath: string;
    readonly fileTagString: string;
    readonly mediaType: string;
    readonly trueMediaType: string;
    readonly copyright: string;
    readonly copyrightDate: Date;
    readonly transformID: number;

    private readonly followObj: Object3D;
    private onClick: () => void;

    private readonly target: RayTarget;

    private static readonly offsetMatrix = new Matrix4()
        .makeTranslation(0, 0, -1.5);

    private readonly originPoint = new Vector3();
    private readonly originRotation = new Quaternion();

    private _isCallout: boolean = false;
    private wasCallout: boolean = null;

    private _alwaysVisible: boolean = false;
    private wasAlwaysVisible: boolean = null;

    private opacity = 1;
    private lastOpacity: number = null;

    private file: IResponse<string> = null;
    private pdf: PDFImage = null;
    private zoomInButton: MeshButton = null;
    private zoomOutButton: MeshButton = null;
    private prevButton: MeshButton = null;
    private pageLabel: TextMesh = null;
    private nextButton: MeshButton = null;

    error: unknown = null;

    constructor(
        private readonly scenario: BaseScenario,
        data: SignData,
        parent: Object3D) {
        super();

        this.followObj = this.scenario.env.worldUISpace;

        this.onClick = () => this.toggle();

        this.key = data.key;
        this.scenarioID = data.scenarioID;
        this.fileID = data.fileID;
        this.fileName = data.fileName;
        this.filePath = data.filePath;
        this.fileTagString = data.fileTagString;
        this.mediaType = data.mediaType;
        this.trueMediaType = data.trueMediaType;
        this.copyright = data.copyright;
        this.copyrightDate = data.copyrightDate;
        this.transformID = data.transformID;

        this.name = `sign-${data.fileName}`;

        this.originPoint.copy(this.position);
        this.originRotation.copy(this.quaternion);

        objGraph(parent, this);

        this._alwaysVisible = data.alwaysVisible;
        this._isCallout = data.isCallout;

        this.start = -1;
        this.end = 0;
        this.t = 1;
        this.direction = -1;
        this.target = new RayTarget(this);

        this.scenario.addScopedEventListener(this, "present", (evt) => {
            if (this.direction !== -1 && evt.source !== this) {
                this.toggle();
            }
        });
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.onDisposing();
            this.disposed = true;
        }
    }

    protected onDisposing() {
        this.scenario.removeScope(this);

        if (isDefined(this.image)) {
            this.image.dispose();
            this.image = null;
        }

        this.removeButton(this.zoomInButton);
        this.zoomInButton = null;

        this.removeButton(this.zoomOutButton);
        this.zoomOutButton = null;

        this.removeButton(this.prevButton);
        this.prevButton = null;

        this.removeButton(this.nextButton);
        this.nextButton = null;

        this.removeButton(this.pageLabel);
        this.pageLabel = null;

        this.pdf = null;
    }

    private removeButton(obj: ErsatzObject | TypedEventBase<any>) {
        if (isDefined(obj)) {
            if (obj instanceof TypedEventBase) {
                obj.removeScope(this);
            }

            if (isErsatzObject(obj)) {
                obj.object.removeFromParent();
                cleanup(obj);
            }
        }
    }

    async load(progress?: IProgress): Promise<void> {
        if (isDefined(this.error)) {
            return Promise.resolve();
        }

        this.disposed = false;

        try {
            const [file, zoomInButton, zoomOutButton] = await all(
                this.scenario.env
                    .fetcher
                    .get(this.filePath)
                    .progress(progress)
                    .file(),
                this.scenario.env.uiButtons.getMeshButton("zoom", "in", iconSize),
                this.scenario.env.uiButtons.getMeshButton("zoom", "out", iconSize)
            );

            this.file = file;

            this.zoomInButton = zoomInButton;
            this.zoomInButton.addScopedEventListener(this, "click", this.onClick);
            this.zoomInButton.object.visible = this.isCallout;

            this.zoomOutButton = zoomOutButton;
            this.zoomOutButton.addScopedEventListener(this, "click", this.onClick);
            this.zoomOutButton.object.visible = false;

            objGraph(this, this.zoomInButton, this.zoomOutButton);

            if (Application_Pdf.matches(this.file.contentType)) {
                this.pdf = new PDFImage(this.file.content, { scale: 2 });

                const [prevButton, nextButton] = await all(
                    this.scenario.env.uiButtons.getMeshButton("arrow", "left", 0.1),
                    this.scenario.env.uiButtons.getMeshButton("arrow", "right", 0.1)
                );

                objGraph(this,
                    this.prevButton = prevButton,
                    this.pageLabel = new TextMesh(this.scenario.env, "label-" + this.transformID, "none", signLabelStyle, { side: FrontSide }),
                    this.nextButton = nextButton
                );

                this.prevButton.addScopedEventListener(this, "click", () => this.loadImage(this.pdf.curPageIndex - 1));
                this.nextButton.addScopedEventListener(this, "click", () => this.loadImage(this.pdf.curPageIndex + 1));
            }

            objGraph(this,
                this.image = new Image2D(this.scenario.env, `Sign(${this.key}) ${file.fileName}`, "dynamic")
            );

            const dweller = new DwellEventer();
            dweller.addEventListener("dwell", (evt) => {
                this.scenario.log("sign viewed", { id: this.transformID, time: evt.dwellTimeSeconds });
            });

            this.target.clickable = true;
            this.target.addEventListener("click", this.onClick);

            this.target.addEventListener("enter", (evt) => {
                if (evt.pointer.type === "nose") {
                    dweller.start();
                }
            });

            this.target.addEventListener("exit", (evt) => {
                if (evt.pointer.type === "nose") {
                    dweller.stop();
                }
            });

            await this.loadImage(0);
        }
        catch (error) {
            this.error = error;
            this.dispose();
        }
    }

    async reload(prog?: IProgress): Promise<void> {
        this.dispose();
        this.error = null;
        await this.load(prog);
    }

    private async loadImage(pageIndex: number): Promise<void> {
        if (this.pdf) {
            this.prevButton.disabled = true;
            this.nextButton.disabled = true;
        }

        const image = await this.getFrame(pageIndex);
        this.image.setTextureMap(image);
        this.image.objectWidth = 1;

        if (this.pdf) {
            const y = this.image.objectHeight / 2;

            this.prevButton.object.visible
                = this.pageLabel.object.visible
                = this.nextButton.object.visible
                = this.hasPages;

            if (this.hasPages) {
                this.prevButton.object.position.set(-0.5, -y, 0.1);
                this.pageLabel.position.set(0, -y, 0.1);
                this.nextButton.object.position.set(0.5, -y, 0.1);

                this.prevButton.disabled = !this.pdf.canGoBack;
                this.pageLabel.image.value = `${this.pdf.curPageNumber} of ${this.pdf.numPages}`;
                this.nextButton.disabled = !this.pdf.canGoForward;
            }
        }
    }

    private async getFrame(pageIndex: number): Promise<CanvasImageTypes> {
        if (this.pdf) {
            this.scenario.log("view sign page", { id: this.transformID, page: pageIndex });
            await this.pdf.getPage(pageIndex);
            return this.pdf.canvas;
        }
        else {
            return await this.scenario.env
                .fetcher
                .get(this.file.content)
                .image()
                .then(unwrapResponse);
        }
    }

    get isCallout(): boolean {
        return this._isCallout;
    }

    set isCallout(v: boolean) {
        this._isCallout = v;
        this.update(0);
    }

    get hasPages(): boolean {
        return this.pdf && this.pdf.numPages > 1;
    }

    get alwaysVisible(): boolean {
        return this._alwaysVisible;
    }

    set alwaysVisible(v: boolean) {
        this._alwaysVisible = v;
        this.update(0);
    }

    get isClickable() {
        return this.isCallout || !this.alwaysVisible;
    }

    get showZoomIn() {
        return this.isClickable
            && this.direction === -1
            && this.t >= this.end;
    }

    get showZoomOut() {
        return this.isClickable
            && this.direction === 1
            && this.t >= this.end;
    }

    toggle() {
        if (isDefined(this.error)) {
            return;
        }

        if (this.isClickable) {
            if (this.direction !== 1) {
                this.scenario.log("expand sign", { id: this.transformID });
                this.target.addMesh(this.image.mesh);
                this.direction = 1;
                const evt = new PresentEvent(this);
                this.scenario.dispatchEvent(evt);
            }
            else {
                this.target.removeMesh(this.image.mesh);
                this.direction = -1;
            }

            const left = Math.max(0, this.end - this.t);
            this.start = performance.now();
            this.end = this.start + TRANSITION_TIME;
            this.t = this.start + left;
        }
    }

    reset() {
        if (isDefined(this.error)) {
            return;
        }

        if (this.isClickable) {
            this.start = -1;
            this.t = 0;
            this.end = 0;
            this.direction = -1;
        }

        if (isDefined(this.image)) {
            this.image.removeWebXRLayer();
        }
    }

    private readonly invMatrix = new Matrix4();
    private readonly dumpScale = new Vector3();
    update(dt: number) {
        if (isDefined(this.error) || !isDefined(this.parent)) {
            return;
        }

        if (isDefined(this.zoomInButton)) {
            this.zoomInButton.object.visible = this.showZoomIn;
            this.zoomOutButton.object.visible = this.showZoomOut;

            if (this.isCallout !== this.wasCallout
                || this.alwaysVisible !== this.wasAlwaysVisible) {
                const x = this.image.objectWidth / 2;
                const y = this.image.objectHeight / 2;

                this.zoomInButton.object.visible = this.isClickable;
                this.zoomOutButton.object.visible = false;

                if (this.alwaysVisible) {
                    this.zoomInButton.object.position.set(x, y, 0.1);
                }
                else {
                    this.zoomInButton.object.position.set(0, 0, 0);
                }

                this.zoomOutButton.object.position.set(x, y, 0.1);

                this.wasCallout = this.isCallout;
                this.wasAlwaysVisible = this.alwaysVisible;
            }
        }

        this.t += SPEED * dt;

        const p = project(this.t, this.start, this.end);
        const q = clamp(p, 0, 1);
        const r = this.direction === 1 ? (1 - q) : q;

        if (this.isCallout) {
            this.invMatrix
                .copy(this.parent.matrixWorld)
                .invert()
                .multiply(this.followObj.matrixWorld)
                .multiply(Sign.offsetMatrix)
                .decompose(this.position, this.quaternion, this.dumpScale);

            this.position.lerp(this.originPoint, r);
            this.quaternion.slerp(this.originRotation, r);
        }

        if (isDefined(this.zoomInButton)) {
            this.zoomInButton.object.lookAt(this.scenario.env.avatar.worldPos);
            this.zoomInButton.object.getWorldPosition(Q);
            this.zoomInButton.size
                = this.zoomOutButton.size
                = iconSize * Q.sub(this.scenario.env.avatar.worldPos).length() / (3 * this.size);
            this.zoomOutButton.object.matrix.copy(this.zoomInButton.object.matrix);
        }

        if (this.alwaysVisible) {
            this.opacity = 1;
        }
        else {
            this.opacity = this.alwaysVisible
                ? 1
                : 1 - r;
        }

        if (this.opacity !== this.lastOpacity) {
            this.image.mesh.material.opacity = this.opacity;
            this.image.mesh.material.transparent = this.opacity < 1;
            this.image.mesh.material.needsUpdate = true;
            this.image.mesh.visible = 0 < this.opacity && this.opacity < 1
                || !(this.scenario.env.showWebXRLayers && this.scenario.env.hasXRCompositionLayers);
            this.image.webXRLayerType = this.opacity === 1
                ? "dynamic"
                : "none";

            if (isDefined(this.pdf)) {
                this.prevButton.object.visible
                    = this.pageLabel.object.visible
                    = this.nextButton.object.visible
                    = this.hasPages && this.opacity === 1;
            }

            this.lastOpacity = this.opacity;
        }
    }

    get size(): number {
        return this.parent.scale.x;
    }

    set size(v: number) {
        this.parent.scale.setScalar(v);
    }

    get rotationX(): number {
        return rad2deg(this.parent.rotation.x);
    }

    get rotationY(): number {
        return rad2deg(this.parent.rotation.y);
    }

    get rotationZ(): number {
        return rad2deg(this.parent.rotation.z);
    }
}