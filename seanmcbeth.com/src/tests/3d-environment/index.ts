import { Model_Gltf_Binary } from "@juniper-lib/mediatypes/dist";
import { AssetGltfModel } from "@juniper-lib/threejs/dist/AssetGltfModel";
import { convertMaterials, materialStandardToBasic } from "@juniper-lib/threejs/dist/materials";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { objectScan } from "@juniper-lib/threejs/dist/objectScan";
import { isMesh } from "@juniper-lib/threejs/dist/typeChecks";
import { HalfPi } from "@juniper-lib/tslib/dist/math";
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