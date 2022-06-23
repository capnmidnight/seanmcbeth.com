﻿import { AssetAudio, AssetCustom, AssetImage, BaseAsset } from "@juniper-lib/fetcher";
import { Audio_Mpeg, Image_Jpeg } from "@juniper-lib/mediatypes";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan, isDefined, isNullOrUndefined } from "@juniper-lib/tslib";

function isMeshNamed(name: string) {
    return (obj: THREE.Object3D) => isMesh(obj) && obj.name === name;
}

function isFalse(v: boolean): v is false {
    return !v;
}

function convertMaterial<T extends boolean>(convert: T, oldMat: MatType<T>, override?: THREE.MeshBasicMaterialParameters): MatType<T> {
    if (isFalse(convert)) {
        return oldMat;
    }

    const params = Object.assign({
        alphaMap: oldMat.alphaMap,
        alphaTest: oldMat.alphaTest,
        alphaToCoverage: oldMat.alphaToCoverage,
        aoMap: oldMat.aoMap,
        aoMapIntensity: oldMat.aoMapIntensity,
        blendDst: oldMat.blendDst,
        blendDstAlpha: oldMat.blendDstAlpha,
        blendEquation: oldMat.blendEquation,
        blendEquationAlpha: oldMat.blendEquationAlpha,
        blending: oldMat.blending,
        blendSrc: oldMat.blendSrc,
        blendSrcAlpha: oldMat.blendSrcAlpha,
        clipIntersection: oldMat.clipIntersection,
        clippingPlanes: oldMat.clippingPlanes,
        clipShadows: oldMat.clipShadows,
        color: oldMat.color,
        colorWrite: oldMat.colorWrite,
        depthFunc: oldMat.depthFunc,
        depthTest: oldMat.depthTest,
        depthWrite: oldMat.depthWrite,
        dithering: oldMat.dithering,
        envMap: oldMat.envMap,
        fog: oldMat.fog,
        lightMap: oldMat.lightMap,
        lightMapIntensity: oldMat.lightMapIntensity,
        map: oldMat.map,
        name: oldMat.name + "-Basic",
        opacity: oldMat.opacity,
        polygonOffset: oldMat.polygonOffset,
        polygonOffsetFactor: oldMat.polygonOffsetFactor,
        polygonOffsetUnits: oldMat.polygonOffsetUnits,
        precision: oldMat.precision,
        premultipliedAlpha: oldMat.premultipliedAlpha,
        shadowSide: oldMat.shadowSide,
        side: oldMat.side,
        stencilFail: oldMat.stencilFail,
        stencilFunc: oldMat.stencilFunc,
        stencilFuncMask: oldMat.stencilFuncMask,
        stencilRef: oldMat.stencilRef,
        stencilWrite: oldMat.stencilWrite,
        stencilWriteMask: oldMat.stencilWriteMask,
        stencilZFail: oldMat.stencilZFail,
        stencilZPass: oldMat.stencilZPass,
        toneMapped: oldMat.toneMapped,
        transparent: oldMat.transparent,
        userData: oldMat.userData,
        vertexColors: oldMat.vertexColors,
        visible: oldMat.visible,
        wireframe: oldMat.wireframe,
        wireframeLinecap: oldMat.wireframeLinecap,
        wireframeLinejoin: oldMat.wireframeLinejoin,
        wireframeLinewidth: oldMat.wireframeLinewidth
    }, override);
    for (const [key, value] of Object.entries(params)) {
        if (isNullOrUndefined(value)) {
            delete (params as any)[key];
        }
    }
    return new THREE.MeshBasicMaterial(params) as MatType<T>;
}

type MatType<T extends boolean> = T extends true ? THREE.MeshBasicMaterial : T extends false ? THREE.MeshStandardMaterial : never;

type MeshType<T extends boolean> = THREE.Mesh<THREE.BufferGeometry, MatType<T>>;

export class Forest<ChoiceT extends boolean> {
    private readonly skybox: AssetImage;
    private readonly forest: AssetCustom<THREE.Group>;
    private readonly tree: AssetCustom<THREE.Group>;
    private readonly bgAudio: AssetAudio;
    private readonly raycaster: THREE.Raycaster;
    private readonly hits: Array<THREE.Intersection>;

    private _ground: MeshType<ChoiceT>;
    private _water: MeshType<ChoiceT>;
    private _trees: THREE.InstancedMesh;

    get ground() {
        return this._ground;
    }

    get water() {
        return this._water;
    }

    get trees() {
        return this._trees;
    }

    readonly assets: BaseAsset<any, any>[];

    constructor(private readonly env: Environment, private readonly useBasicMaterial: ChoiceT, private readonly density = 0.05) {
        this.assets = [
            this.skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg),
            this.forest = env.modelAsset("/models/Forest-Ground.glb"),
            this.bgAudio = new AssetAudio("/audio/forest.mp3", Audio_Mpeg)
        ];
        if (this.density > 0) {
            this.assets.push(this.tree = env.modelAsset("/models/Forest-Tree.glb"));
        }
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
        this.hits = new Array<THREE.Intersection>();

        Promise.all(this.assets)
            .then(() => this.finish())
    }

    private finish(): void {
        this.env.skybox.setImage("forest", this.skybox.result);
        this.env.audio.createClip("forest", this.bgAudio.result, true, true, true, 1, []);
        this.env.audio.setClipPosition("forest", 25, 5, 25);
        this.env.foreground.add(this.forest.result);
        this.forest.result.updateMatrixWorld();
        this.raycaster.camera = this.env.camera;

        this._ground = objectScan<MeshType<ChoiceT>>(this.forest.result, isMeshNamed("Ground"));
        this.env.timer.addTickHandler(() => {
            const groundHit = this.groundTest(this.env.avatar.worldPos);
            if (groundHit) {
                this.env.avatar.stage.position.y = groundHit.point.y;
            }
        });

        this._water = objectScan<MeshType<ChoiceT>>(this.forest.result, isMeshNamed("Water"));

        this._ground.material = convertMaterial(this.useBasicMaterial, this._ground.material, { transparent: false });
        this._water.material = convertMaterial(this.useBasicMaterial, this._water.material, { transparent: false }) as MatType<ChoiceT>;

        if (this.density > 0) {
            const matrices = this.makeTrees();
            const treeMesh = objectScan<MeshType<ChoiceT>>(this.tree.result, isMesh);
            const treeGeom = treeMesh.geometry;
            const treeMat = convertMaterial(this.useBasicMaterial, treeMesh.material, { transparent: false });

            this._trees = new THREE.InstancedMesh(treeGeom, treeMat, matrices.length);

            for (let i = 0; i < matrices.length; ++i) {
                this._trees.setMatrixAt(i, matrices[i]);
            }

            this.env.foreground.add(this._trees);
        }
    }

    private makeTrees() {
        const matrices = new Array<THREE.Matrix4>();
        const q = new THREE.Quaternion();
        const right = new THREE.Vector3(1, 0, 0);
        const p = new THREE.Vector3();
        const q2 = new THREE.Quaternion().setFromAxisAngle(right, Math.PI / 2);
        const up = new THREE.Vector3(0, 1, 0);
        const s = new THREE.Vector3();
        for (let dz = -25; dz <= 25; ++dz) {
            for (let dx = -25; dx <= 25; ++dx) {
                if ((dx !== 0 || dx !== 0) // don't put a tree on top of the spawn point
                    && Math.random() <= this.density) {
                    const x = Math.random() * 0.1 + dx;
                    const z = Math.random() * 0.1 + dz;
                    p.set(x, 0, z);
                    const groundHit = this.groundTest(p);
                    if (groundHit) {
                        const w = THREE.MathUtils.randFloat(0.6, 1.3);
                        const h = THREE.MathUtils.randFloat(0.6, 1.3);
                        s.set(w, h, w);
                        const a = THREE.MathUtils.randFloat(0, 2 * Math.PI);
                        const m = new THREE.Matrix4()
                            .compose(
                                groundHit.point,
                                q.setFromAxisAngle(up, a).multiply(q2),
                                s
                            );
                        matrices.push(m);
                    }
                }
            }
        }
        return matrices;
    }

    groundTest(p: THREE.Vector3): THREE.Intersection {
        this.raycaster.ray.origin.copy(p);
        this.raycaster.ray.origin.y += 10;
        this.raycaster.intersectObject(this.ground, true, this.hits);
        const groundHit = arrayScan(this.hits, isDefined);
        arrayClear(this.hits);
        return groundHit;
    }
}