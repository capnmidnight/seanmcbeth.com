import { AssetAudio, AssetImage, BaseAsset } from "@juniper-lib/fetcher";
import { Audio_Mpeg, Image_Jpeg, Model_Gltf_Binary } from "@juniper-lib/mediatypes";
import { AssetGltfModel } from "@juniper-lib/threejs/AssetGltfModel";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { materialStandardToBasic } from "@juniper-lib/threejs/materials";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan, isDefined } from "@juniper-lib/tslib";
import { isDebug } from "../isDebug";
import { defaultAvatarHeight } from "../settings";

function isMeshNamed(name: string) {
    return (obj: THREE.Object3D) => isMesh(obj) && obj.name === name;
}

export class Forest {
    private readonly skybox: AssetImage;
    private readonly forest: AssetGltfModel;
    private readonly tree: AssetGltfModel;
    private readonly bgAudio: AssetAudio;
    private readonly raycaster: THREE.Raycaster;
    private readonly hits: Array<THREE.Intersection>;

    private _ground: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
    private _water: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
    private _trees: THREE.InstancedMesh;
    private navMesh: RayTarget;

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

    constructor(private readonly env: Environment) {
        this.assets = [
            this.skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug),
            this.forest = new AssetGltfModel("/models/Forest-Ground.glb", Model_Gltf_Binary, !isDebug),
            this.bgAudio = new AssetAudio("/audio/forest.mp3", Audio_Mpeg, !isDebug),
            this.tree = new AssetGltfModel("/models/Forest-Tree.glb", Model_Gltf_Binary, !isDebug)
        ];

        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
        this.hits = new Array<THREE.Intersection>();

        Promise.all(this.assets)
            .then(() => this.finish())
    }

    private convertMesh(oldMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>): THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> {
        const oldMat = oldMesh.material;
        const newMat = materialStandardToBasic(oldMesh.material);
        if (newMat as any === oldMat) {
            return oldMesh as any;
        }

        const newMesh = oldMesh as any as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
        newMesh.material = newMat;
        oldMat.dispose();
        return newMesh;
    }

    private finish(): void {
        this.env.skybox.setImage("forest", this.skybox.result);
        const clip = this.env.audio.createClip("forest", this.bgAudio.result, true, true, true, 1, []);
        this.env.addEventListener("environmentaudiotoggled", () => {
            if (this.env.environmentAudioMuted) {
                clip.stop();
            }
            else {
                clip.play();
            }
        });


        this.env.audio.setClipPosition("forest", 25, 5, 25);
        this.env.foreground.add(this.forest.result.scene);
        this.forest.result.scene.updateMatrixWorld();
        this.raycaster.camera = this.env.camera;

        const ground = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(this.forest.result.scene, isMeshNamed("Ground"));
        this._ground = this.convertMesh(ground);

        this.navMesh = new RayTarget(this._ground);
        this.navMesh.addMesh(this._ground);
        this.navMesh.navigable = true;
        this.navMesh.addEventListener("click", async (evt) => {
            if (evt.pointer.canTeleport) {
                await this.env.fadeOut();
                this.env.avatar.stage.position.copy(evt.hit.point);
                this.env.avatar.stage.position.y += defaultAvatarHeight;
                await this.env.fadeIn();
            }
        });

        this.env.timer.addTickHandler(() => {
            const groundHit = this.groundTest(this.env.avatar.worldPos);
            if (groundHit) {
                this.env.avatar.stage.position.y = groundHit.point.y;
            }
        });

        const water = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(this.forest.result.scene, isMeshNamed("Water"));
        this._water = this.convertMesh(water);

        const matrices = this.makeTrees();
        const treeMesh = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(this.tree.result.scene, isMesh);
        const treeGeom = treeMesh.geometry;
        const treeMat = materialStandardToBasic(treeMesh.material);

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