import { dispose } from "@juniper-lib/dom/dist/canvas";
import { AssetImage, AssetWorker } from "@juniper-lib/fetcher/dist/Asset";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import { RayTarget } from "@juniper-lib/threejs/dist/eventSystem/RayTarget";
import type { Pointer3DEvent } from "@juniper-lib/threejs/dist/eventSystem/devices/Pointer3DEvent";
import { mesh } from "@juniper-lib/threejs/dist/objects";
import { FrontSide, LinearFilter, LinearMipmapLinearFilter, MeshPhongMaterial, PlaneGeometry, Texture } from "three";
import { withTestEnvironment } from "../../createTestEnvironment";
import { Forest } from "../../forest/Forest";
import { JS_EXT, isDebug } from "../../isDebug";
import { version } from "../../settings";
import { DirtWorkerClient } from "../../workers/dirt/DirtWorkerClient";

const S = 5;
const R = 200;
const F = 2;
const P = 1;

withTestEnvironment(async (env) => {

    const dirtMapAsset = new AssetImage("/img/dirt.jpg", Image_Jpeg, !isDebug);
    const dirtWorkerAsset = new AssetWorker(`/js/workers/dirt/index${JS_EXT}?${version}`);

    const forest = new Forest(env);
    await env.load(dirtMapAsset, dirtWorkerAsset, ...forest.assets);

    const dirtMapTex = new Texture(dirtMapAsset.result);
    dirtMapTex.minFilter = LinearMipmapLinearFilter;
    dirtMapTex.magFilter = LinearFilter;
    dirtMapTex.needsUpdate = true;

    const dirtBumpMapTex = new Texture(null);
    dirtBumpMapTex.minFilter = LinearMipmapLinearFilter;
    dirtBumpMapTex.magFilter = LinearFilter;

    const dirtBumpMap = new DirtWorkerClient(dirtWorkerAsset.result);
    dirtBumpMap.addEventListener("update", (evt) => {
        dispose(dirtBumpMapTex.image);
        dirtBumpMapTex.image = evt.imgBmp;
        dirtBumpMapTex.needsUpdate = true;
    });
    await dirtBumpMap.init(R, R, F, P);

    const dirtGeom = new PlaneGeometry(S, S, R, R);

    const dirtMat = new MeshPhongMaterial({
        precision: "highp",
        map: dirtMapTex,
        bumpMap: dirtBumpMapTex,
        bumpScale: 0.1,
        displacementMap: dirtBumpMapTex,
        displacementScale: 0.1,
        displacementBias: -0.05,
        shininess: 0,
        reflectivity: 0,
        side: FrontSide
    });

    const dirt = mesh("Dirt", dirtGeom, dirtMat);
    dirt.position.set(0, 0.1, 1);
    dirt.rotation.x = -Math.PI / 2;

    const dirtSurface = mesh("DirtSurface", new PlaneGeometry(S, S, 1, 1));
    dirtSurface.visible = false;
    dirt.add(dirtSurface);

    const dirtTarget = new RayTarget(dirt);
    dirtTarget.addMesh(dirtSurface);
    dirtTarget.draggable = true;
    dirtTarget.addEventListener("down", checkPointer);
    dirtTarget.addEventListener("move", checkPointer);
    dirtTarget.addEventListener("up", checkPointer);

    Object.assign(window, { dirt });

    env.foreground.add(dirt);

    env.sun.position.set(-1, 3, -2);

    function checkPointer(evt: Pointer3DEvent) {
        dirtBumpMap.checkPointerUV(
            evt.pointer.id,
            evt.hit.uv.x,
            1 - evt.hit.uv.y,
            evt.type);
    }
});