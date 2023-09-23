import { Model_Gltf_Binary } from "@juniper-lib/mediatypes";
import { AssetGltfModel } from "@juniper-lib/threejs/AssetGltfModel";
import { convertMaterials, materialStandardToBasic } from "@juniper-lib/threejs/materials";
import { objGraph } from "@juniper-lib/threejs/objects";
import { objectScan } from "@juniper-lib/threejs/objectScan";
import { isMesh } from "@juniper-lib/threejs/typeChecks";
import { HalfPi } from "@juniper-lib/tslib/math";
import { Mesh } from "three";
import { createTestEnvironment } from "../../createTestEnvironment";
import { isDebug } from "../../isDebug";

(async function () {
    const env = await createTestEnvironment();
    const model = new AssetGltfModel(env, "/models/office/DLS.glb", Model_Gltf_Binary, !isDebug);

    await env.withFade(async () => {
        env.sun.intensity = 0;
        env.ambient.intensity = 1;

        await env.load(model);

        const root = objectScan<Mesh>(model.result.scene, isMesh);
        convertMaterials(root, materialStandardToBasic);

        root.rotation.y = -HalfPi;
        objGraph(env.scene, root);
    });
})();