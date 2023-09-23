import { upArrowText } from "@juniper-lib/emoji";
import { Cube } from "@juniper-lib/threejs/Cube";
import type { BaseEnvironment } from "@juniper-lib/threejs/environment/BaseEnvironment";
import { solidWhite } from "@juniper-lib/threejs/materials";
import { ErsatzObject, objGraph } from "@juniper-lib/threejs/objects";
import { TextMeshButton } from "@juniper-lib/threejs/widgets/TextMeshButton";
import { TypedEvent } from "@juniper-lib/events/EventBase";
import { BaseProgress } from "@juniper-lib/progress/BaseProgress";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { Matrix4, Object3D } from "three";
import { textButtonStyle } from "../../settings";
import { StationConnectionData } from "./data";
import type { Transform } from "./Transform";

const DEFAULT_NAV_ICON = ` ${upArrowText.textStyle} `;
const TEST_OBJECT = new Object3D();

export class Connection
    extends BaseProgress<{
        click: TypedEvent<"click">;
    }>
    implements IProgress, ErsatzObject, StationConnectionData {
    private icon: TextMeshButton;
    private progressBar: Cube;

    get object() {
        return this.transform;
    }

    get fromStationID(): number {
        return this.from.transformID;
    }

    get toStationID(): number {
        return this.to.transformID;
    }

    get transformID(): number {
        return this.transform && this.transform.transformID;
    }

    constructor(
        protected readonly env: BaseEnvironment<unknown>,
        public readonly transform: Transform,
        private readonly from: Transform,
        private readonly to: Transform,
        label: string) {
        super();

        label = label || DEFAULT_NAV_ICON;

        this.icon = new TextMeshButton(this.env, "navButton", label, textButtonStyle);

        this.icon.addEventListener("click", (evt) => {
            if (this.enabled) {
                this.dispatchEvent(evt);
            }
        });
        this.transform.scale.setScalar(0.5);

        this.progressBar = new Cube(this.icon.image.width, 0.025, 0.01, solidWhite);
        this.progressBar.position.y = -this.icon.image.height / 2;
        this.progressBar.position.z = 0.01;

        objGraph(this.transform,
            objGraph(this.icon,
                this.progressBar));
    }

    override report(soFar: number, total: number, msg?: string, est?: number) {
        super.report(soFar, total, msg, est);

        const width = this.icon.image.width * this.p;
        this.progressBar.position.x = 0.5 * (width - this.icon.image.width);
        this.progressBar.scale.x = width;
    }

    get label() {
        return this.icon.image.value;
    }

    set label(v) {
        this.icon.image.value
            = this.icon.image.value
            = v || DEFAULT_NAV_ICON;
    }

    get enabled() {
        return !this.icon.disabled;
    }

    set enabled(v) {
        this.icon.disabled = !v;
        this.progressBar.visible = !v;
    }

    static calcMatrix(from: Transform, to: Transform, defaultAvatarHeight: number, object: Object3D = null): Matrix4 {
        object = object || TEST_OBJECT;
        const parent = object.parent;
        if (parent) {
            parent.remove(object);
        }
        object.position.copy(to.position);
        object.position.sub(from.position);
        object.position.y = 0;
        object.position.normalize();
        object.position.multiplyScalar(1.5);
        object.position.y += 1;
        object.lookAt(0, defaultAvatarHeight, 0);
        object.updateMatrix();
        if (parent) {
            objGraph(parent, object);
        }
        return object.matrix;
    }

    resetPosition() {
        Connection.calcMatrix(this.from, this.to, this.env.defaultAvatarHeight, this.object);
    }
}