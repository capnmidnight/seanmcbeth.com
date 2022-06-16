import { Asset } from "@juniper-lib/fetcher";
import { Audio_Mpeg, Image_Jpeg, Image_Png, Model_Gltf_Binary } from "@juniper-lib/mediatypes";
import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { InteractiveObject3D } from "@juniper-lib/threejs/eventSystem/InteractiveObject3D";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { arrayClear, arrayScan, IProgress, isDefined, progressTasksWeighted } from "@juniper-lib/tslib";

function isMeshNamed(name: string) {
    return (obj: THREE.Object3D) => isMesh(obj) && obj.name === name;
}

export class Forest {
    private readonly skybox: Asset<HTMLImageElement>;
    private readonly forest: Asset<THREE.Group>;
    private readonly tree: Asset<THREE.Group>;
    private readonly bgAudio: Asset<HTMLAudioElement>;
    private readonly raycaster: THREE.Raycaster;
    private readonly hits: Array<THREE.Intersection>;

    private _ground: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & InteractiveObject3D;
    private _water: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & InteractiveObject3D;
    private _trees: THREE.InstancedMesh & InteractiveObject3D;

    get ground() {
        return this._ground;
    }

    get water() {
        return this._water;
    }

    get trees() {
        return this._trees;
    }

    constructor(private readonly env: Environment) {
        //this.env.eventSystem.mouse.allowPointerLock = true;

        this.getJpeg = this.getJpeg.bind(this);
        this.getPng = this.getPng.bind(this);
        this.getModel = this.getModel.bind(this);
        this.getAudio = this.getAudio.bind(this);

        this.skybox = new Asset("/skyboxes/BearfenceMountain.jpeg", this.getJpeg);
        this.forest = new Asset("/models/Forest-Ground.glb", this.getModel);
        this.tree = new Asset("/models/Forest-Tree.glb", this.getModel);
        this.bgAudio = new Asset("/audio/forest.mp3", this.getAudio);
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
        this.hits = new Array<THREE.Intersection>();
    }

    async load<T extends Asset<any>[]>(...assets: T): Promise<T> {
        await progressTasksWeighted(this.env.loadingBar, [
            [1, (prog) => this.env.load(prog)],
            [10, (prog) => this.env.fetcher.assets(prog,
                this.skybox,
                this.forest,
                this.tree,
                this.bgAudio,
                ...assets
            )]
        ]);

        this.env.skybox.setImage("forest", this.skybox.result);
        this.env.audio.createClip("forest", this.bgAudio.result, true, true, true, 1, []);
        this.env.audio.setClipPosition("forest", 25, 5, 25);
        this.env.foreground.add(this.forest.result);
        this.forest.result.updateMatrixWorld();
        this.raycaster.camera = this.env.camera;

        this._ground = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & InteractiveObject3D>(this.forest.result, isMeshNamed("Ground"));
        this._water = objectScan<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> & InteractiveObject3D>(this.forest.result, isMeshNamed("Water"));

        const matrices = this.makeTrees();
        const treeMesh = objectScan<THREE.Mesh & InteractiveObject3D>(this.tree.result, isMesh);
        const treeGeom = treeMesh.geometry;
        const treeMat = treeMesh.material;

        this._trees = new THREE.InstancedMesh(treeGeom, treeMat, matrices.length);

        for (let i = 0; i < matrices.length; ++i) {
            this._trees.setMatrixAt(i, matrices[i]);
        }

        this.env.foreground.add(this._trees);
        this.env.timer.addTickHandler(() => {
            const groundHit = this.groundTest(this.env.avatar.worldPos);
            if (groundHit) {
                this.env.avatar.stage.position.y = groundHit.point.y;
            }
        });

        return assets;
    }


    getJpeg(path: string, prog?: IProgress) {
        return this.env.fetcher
            .get(path)
            .useCache(true)
            .progress(prog)
            .image(Image_Jpeg)
            .then(response => response.content);
    }

    getPng(path: string, prog?: IProgress) {
        return this.env.fetcher
            .get(path)
            .useCache(false)
            .progress(prog)
            .image(Image_Png)
            .then(response => response.content);
    }

    getAudio(path: string, prog?: IProgress) {
        return this.env.fetcher
            .get(path)
            .useCache(true)
            .progress(prog)
            .audio(true, true, Audio_Mpeg)
            .then(response => response.content);
    }

    getModel(path: string, prog?: IProgress) {
        return this.env.fetcher
            .get(path)
            .useCache(true)
            .progress(prog)
            .file(Model_Gltf_Binary)
            .then(response => this.env.loadModel(response.content));
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
                if (Math.random() <= 0.1) {
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