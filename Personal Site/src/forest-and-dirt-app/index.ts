import { createUtilityCanvas } from "@juniper-lib/dom/canvas";
import { AssetImage } from "@juniper-lib/fetcher";
import { Image_Jpeg } from "@juniper-lib/mediatypes";
import type { Pointer3DEvent } from "@juniper-lib/threejs/eventSystem/Pointer3DEvent";
import { RayTarget } from "@juniper-lib/threejs/eventSystem/RayTarget";
import { mesh } from "@juniper-lib/threejs/objects";
import { createTestEnvironment } from "../createTestEnvironment";
import { DirtService } from "../dirt-worker/DirtService";
import { Forest } from "../forest-app/Forest";
import { isDebug } from "../isDebug";

(async function () {
    const S = 5;
    const R = 200;
    const F = 2;
    const P = 1;

    const env = await createTestEnvironment(isDebug);
    await env.fadeOut();

    const dirtMapAsset = new AssetImage("/img/dirt.jpg", Image_Jpeg, !isDebug);

    const forest = new Forest(env);
    await env.load(dirtMapAsset, ...forest.assets);

    const dirtMapTex = new THREE.Texture(dirtMapAsset.result);
    dirtMapTex.minFilter = THREE.LinearMipmapLinearFilter;
    dirtMapTex.magFilter = THREE.LinearFilter;
    dirtMapTex.needsUpdate = true;

    const dirtBumpMap = new DirtService();
    await dirtBumpMap.init(createUtilityCanvas(R, R), F, P);

    const dirtBumpMapTex = new THREE.Texture(dirtBumpMap.canvas as any);
    dirtBumpMapTex.minFilter = THREE.LinearMipmapLinearFilter;
    dirtBumpMapTex.magFilter = THREE.LinearFilter;
    dirtBumpMapTex.needsUpdate = true;

    dirtBumpMap.addEventListener("update", () =>
        dirtBumpMapTex.needsUpdate = true);

    const dirtGeom = new THREE.PlaneBufferGeometry(S, S, R, R);

    const dirtMat = new THREE.MeshPhongMaterial({
        precision: "highp",
        map: dirtMapTex,
        bumpMap: dirtBumpMapTex,
        bumpScale: 0.1,
        displacementMap: dirtBumpMapTex,
        displacementScale: 0.1,
        displacementBias: -0.05,
        shininess: 0,
        reflectivity: 0,
        side: THREE.FrontSide
    });

    const dirt = mesh("Dirt", dirtGeom, dirtMat);
    dirt.position.set(0, 0.1, 1);
    dirt.rotation.x = -Math.PI / 2;

    const dirtSurface = mesh("DirtSurface", new THREE.PlaneBufferGeometry(S, S, 1, 1));
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

    await env.fadeIn();

    function checkPointer(evt: Pointer3DEvent) {
        dirtBumpMap.checkPointerUV(
            evt.pointer.id,
            evt.hit.uv.x,
            1 - evt.hit.uv.y,
            evt.type);
    }
})();