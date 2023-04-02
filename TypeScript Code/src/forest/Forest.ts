import { AssetFile, AssetImage, BaseAsset } from "@juniper-lib/fetcher/Asset";
import { Audio_Mpeg, Image_Jpeg, Model_Gltf_Binary } from "@juniper-lib/mediatypes";
import { AssetGltfModel } from "@juniper-lib/threejs/AssetGltfModel";
import { Cube } from "@juniper-lib/threejs/Cube";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { materialStandardToBasic, solidRed } from "@juniper-lib/threejs/materials";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan } from "@juniper-lib/tslib/collections/arrays";
import { Tau } from "@juniper-lib/tslib/math";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { BufferGeometry, InstancedMesh, Intersection, MathUtils, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Quaternion, Raycaster, Vector3 } from "three";
import { isDebug } from "../isDebug";
import { defaultAvatarHeight } from "../settings";

function isMeshNamed(name: string) {
    return (obj: Object3D) => isMesh(obj) && obj.name === name;
}

export class Forest {
    private readonly skybox: AssetImage;
    private readonly forest: AssetGltfModel;
    private readonly tree: AssetGltfModel;
    private readonly bgAudio: AssetFile;
    private readonly raycaster: Raycaster;
    private readonly hits: Array<Intersection>;

    private _ground: Mesh<BufferGeometry, MeshBasicMaterial>;
    private _water: Mesh<BufferGeometry, MeshBasicMaterial>;
    private _trees: InstancedMesh;
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
            this.forest = new AssetGltfModel(this.env, "/models/Forest-Ground.glb", Model_Gltf_Binary, !isDebug),
            this.bgAudio = new AssetFile("/audio/forest.mp3", Audio_Mpeg, !isDebug),
            this.tree = new AssetGltfModel(this.env, "/models/Forest-Tree.glb", Model_Gltf_Binary, !isDebug)
        ];

        this.raycaster = new Raycaster(new Vector3(), new Vector3(0, -1, 0), 0.1, 100);
        this.hits = new Array<Intersection>();

        Promise.all(this.assets)
            .then(() => this.finish())
    }

    private convertMesh(oldMesh: Mesh<BufferGeometry, MeshStandardMaterial>): Mesh<BufferGeometry, MeshBasicMaterial> {
        const oldMat = oldMesh.material;
        const newMat = materialStandardToBasic(oldMesh.material);
        if (newMat as any === oldMat) {
            return oldMesh as any;
        }

        const newMesh = oldMesh as any as Mesh<BufferGeometry, MeshBasicMaterial>;
        newMesh.material = newMat;
        oldMat.dispose();
        return newMesh;
    }

    private async finish(): Promise<void> {
        this.env.skybox.setImage("forest", this.skybox.result);
        this.env.audio.setAudioProperties(0.1, 100, "inverse");

        for (let i = 0; i < 5; ++i) {
            const name = `forest-${i}`;
            const clip = await this.env.audio.createClip(name, this.bgAudio, true, true, true, true, 1, []);
            this.env.addEventListener("environmentaudiotoggled", () => {
                if (this.env.environmentAudioMuted) {
                    clip.stop();
                }
                else {
                    clip.play();
                }
            });

            const x = Math.random() * 50 - 25;
            const z = Math.random() * 50 - 25;
            clip.volume = 0.25;

            const obj = new Cube(1, 1, 1, solidRed);
            clip.setPosition(x, 5, z);
            obj.position.set(x, 5, z);
            this.env.foreground.add(obj);
        }

        this.env.foreground.add(this.forest.result.scene);
        this.forest.result.scene.updateMatrixWorld();
        this.raycaster.camera = this.env.camera;

        const ground = objectScan<Mesh<BufferGeometry, MeshStandardMaterial>>(this.forest.result.scene, isMeshNamed("Ground"));
        this._ground = this.convertMesh(ground);

        this.navMesh = new RayTarget(this._ground);
        this.navMesh.addMesh(this._ground);
        this.navMesh.navigable = true;
        this.navMesh.addEventListener("click", async (evt) => {
            if (evt.pointer.canTeleport) {
                this.env.audio.playClip("footsteps");
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

        const water = objectScan<Mesh<BufferGeometry, MeshStandardMaterial>>(this.forest.result.scene, isMeshNamed("Water"));
        this._water = this.convertMesh(water);

        const matrices = this.makeTrees();
        const treeMesh = objectScan<Mesh<BufferGeometry, MeshStandardMaterial>>(this.tree.result.scene, isMesh);
        const treeGeom = treeMesh.geometry;
        const treeMat = materialStandardToBasic(treeMesh.material);

        this._trees = new InstancedMesh(treeGeom, treeMat, matrices.length);

        for (let i = 0; i < matrices.length; ++i) {
            this._trees.setMatrixAt(i, matrices[i]);
        }

        this.env.foreground.add(this._trees);
    }

    private makeTrees() {
        const matrices = new Array<Matrix4>();
        const q = new Quaternion();
        const right = new Vector3(1, 0, 0);
        const p = new Vector3();
        const q2 = new Quaternion().setFromAxisAngle(right, Math.PI / 2);
        const up = new Vector3(0, 1, 0);
        const s = new Vector3();
        for (let dz = -25; dz <= 25; ++dz) {
            for (let dx = -25; dx <= 25; ++dx) {
                if ((dx !== 0 || dx !== 0) // don't put a tree on top of the spawn point
                    && Math.random() <= 0.02) {
                    const x = Math.random() * 0.1 + dx;
                    const z = Math.random() * 0.1 + dz;
                    p.set(x, 0, z);
                    const groundHit = this.groundTest(p);
                    if (groundHit) {
                        const w = MathUtils.randFloat(0.6, 1.3);
                        const h = MathUtils.randFloat(0.6, 1.3);
                        s.set(w, h, w);
                        const a = MathUtils.randFloat(0, Tau);
                        const m = new Matrix4()
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

    groundTest(p: Vector3): Intersection {
        this.raycaster.ray.origin.copy(p);
        this.raycaster.ray.origin.y += 10;
        this.raycaster.intersectObject(this.ground, true, this.hits);
        const groundHit = arrayScan(this.hits, isDefined);
        arrayClear(this.hits);
        return groundHit;
    }
}