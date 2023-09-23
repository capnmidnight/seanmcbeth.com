import { Matrix4, Object3D } from "three";
import type { TransformData } from "./data";

export class Transform
    extends Object3D {

    readonly data: TransformData;

    private readonly M = new Matrix4();

    constructor(data: TransformData) {
        super();

        this.data = data;
        this.name = data.name;

        this.M.fromArray(data.matrix);
        this.M.decompose(this.position, this.quaternion, this.scale);
    }

    get transformID() {
        return this.data.id;
    }
}