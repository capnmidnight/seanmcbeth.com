import { AssetAudio, AssetCustom, AssetImage, BaseAsset } from "@juniper-lib/fetcher";
import { Audio_Mpeg, Image_Jpeg } from "@juniper-lib/mediatypes";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan, isDefined } from "@juniper-lib/tslib";

function isMeshNamed(name: string) {
    return (obj: THREE.Object3D) => isMesh(obj) && obj.name === name;
}

export class Forest<MatT extends THREE.Material = THREE.MeshPhongMaterial> {
    private readonly skybox: AssetImage;
    private readonly forest: AssetCustom<THREE.Group>;
    private readonly tree: AssetCustom<THREE.Group>;
    private readonly bgAudio: AssetAudio;
    private readonly raycaster: THREE.Raycaster;
    private readonly hits: Array<THREE.Intersection>;

    private _ground: THREE.Mesh<THREE.BufferGeometry, MatT>;
    private _water: THREE.Mesh<THREE.BufferGeometry, MatT>;
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

    constructor(private readonly env: Environment, private readonly convertMaterial: (mat: THREE.MeshPhongMaterial, transparent?: boolean) => MatT) {
        this.assets = [
            this.skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !DEBUG),
            this.forest = env.modelAsset("/models/Forest-Ground.glb"),
            this.bgAudio = new AssetAudio("/audio/forest.mp3", Audio_Mpeg, !DEBUG),
            this.tree = env.modelAsset("/models/Forest-Tree.glb")
        ];

        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
        this.hits = new Array<THREE.Intersection>();

        Promise.all(this.assets)
            .then(() => this.finish())
    }

    private convertMesh(oldMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>): THREE.Mesh<THREE.BufferGeometry, MatT> {
        const oldMat = oldMesh.material;
        const newMat = this.convertMaterial(oldMesh.material, false);
        if (newMat as any === oldMat) {
            return oldMesh as any;
        }

        const newMesh = oldMesh as any as THREE.Mesh<THREE.BufferGeometry, MatT>;
        newMesh.material = newMat;
        oldMat.dispose();
        return newMesh;
    }

    private finish(): void {
        this.env.skybox.setImage("forest", this.skybox.result);
        this.env.audio.createClip("forest", this.bgAudio.result, true, true, true, 1, []);
        this.env.audio.setClipPosition("forest", 25, 5, 25);
        this.env.foreground.add(this.forest.result);
        this.forest.result.updateMatrixWorld();
        this.raycaster.camera = this.env.camera;

        const ground = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>>(this.forest.result, isMeshNamed("Ground"));
        this._ground = this.convertMesh(ground);

        this.env.timer.addTickHandler(() => {
            const groundHit = this.groundTest(this.env.avatar.worldPos);
            if (groundHit) {
                this.env.avatar.stage.position.y = groundHit.point.y;
            }
        });

        const water = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>>(this.forest.result, isMeshNamed("Water"));
        this._water = this.convertMesh(water);

        const matrices = this.makeTrees();
        const treeMesh = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>>(this.tree.result, isMesh);
        const treeGeom = treeMesh.geometry;
        const treeMat = this.convertMaterial(treeMesh.material, false);

        this._trees = new THREE.InstancedMesh(treeGeom, treeMat, matrices.length);

        for (let i = 0; i < matrices.length; ++i) {
            this._trees.setMatrixAt(i, matrices[i]);
        }

        this.env.foreground.add(this._trees);
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
                    && Math.random() <= 0.02) {
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