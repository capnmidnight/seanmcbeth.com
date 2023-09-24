import { AssetGltfModel } from "@juniper-lib/threejs/dist/AssetGltfModel";
import { cleanup } from "@juniper-lib/threejs/dist/cleanup";
import { RayTarget } from "@juniper-lib/threejs/dist/eventSystem/RayTarget";
import { GLTF } from "@juniper-lib/threejs/dist/examples/loaders/GLTFLoader";
import { convertMaterials, materialStandardToPhong } from "@juniper-lib/threejs/dist/materials";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { isMesh } from "@juniper-lib/threejs/dist/typeChecks";
import { DwellEventer } from "@juniper-lib/events/dist/DwellEventer";
import { rad2deg } from "@juniper-lib/tslib/dist/math";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { singleton } from "@juniper-lib/tslib/dist/singleton";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { IDisposable } from "@juniper-lib/tslib/dist/using";
import { Object3D } from "three";
import { BaseScenario } from "./BaseScenario";
import type { ModelData } from "./data";

const modelTemplateTasks = singleton("Yarrow:Model:modelTemplateTasks", () => new Map<string, Promise<GLTF>>());

export class Model
    extends Object3D
    implements IDisposable, ModelData {

    model: Object3D = null;

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

    private readonly target: RayTarget;

    error: unknown = null;

    constructor(private readonly scenario: BaseScenario, model: ModelData, parent: Object3D) {
        super();
        this.name = `model-${model.fileName}`;

        this.key = model.key;
        this.scenarioID = model.scenarioID;
        this.fileID = model.fileID;
        this.fileName = model.fileName;
        this.filePath = model.filePath;
        this.fileTagString = model.fileTagString;
        this.transformID = model.transformID;
        this.mediaType = model.mediaType;
        this.trueMediaType = model.trueMediaType;
        this.copyright = model.copyright;
        this.copyrightDate = model.copyrightDate;

        this.target = new RayTarget(this);

        objGraph(parent, this);

        Object.seal(this);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.onDisposing();
            this.disposed = true;
        }
    }

    protected onDisposing() {
        if (isDefined(this.model)) {
            this.model.removeFromParent();
            cleanup(this.model);
            this.model = null;
        }
    }

    async load(prog?: IProgress): Promise<void> {
        if (isDefined(this.error)) {
            return Promise.resolve();
        }

        this.disposed = false;

        let templateTask = modelTemplateTasks.get(this.filePath);
        if (!templateTask) {
            const asset = new AssetGltfModel(this.scenario.env, this.filePath, this.mediaType, !this.scenario.env.DEBUG);
            templateTask = asset
                .then(template => {
                    try {
                        convertMaterials(template.scene, materialStandardToPhong);
                    }
                    catch (err) {
                        this.error = err;
                    }
                    return template;
                });
            modelTemplateTasks.set(this.filePath, templateTask);
            this.scenario.env.fetcher.assets(prog, asset);
        }
        const template = await templateTask;

        const dweller = new DwellEventer();
        dweller.addEventListener("dwell", (evt) => {
            this.scenario.log("model viewed", { id: this.transformID, time: evt.dwellTimeSeconds });
        });

        this.model = template.scene.clone(true);
        this.model.traverse((obj) => {
            if (isMesh(obj)) {
                this.target.addMesh(obj);
            }
        });

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

        objGraph(this, this.model);
    }

    async reload(prog?: IProgress): Promise<void> {
        this.dispose();
        this.error = null;
        await this.load(prog);
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