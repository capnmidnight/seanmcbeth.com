import { Asset } from "@juniper-lib/fetcher";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env);
const [spatter] = await forest.load(new Asset("/img/spatter.png", forest.getPng));
const grassGeom = new THREE.PlaneBufferGeometry(5, 5, 1, 1);

const grassTex = new THREE.Texture(spatter.result);
grassTex.needsUpdate = true;

const grassMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
});

const grass = new THREE.InstancedMesh(grassGeom, grassMat, 25);

const dummy = new THREE.Object3D();
dummy.rotation.set(Math.PI / 2, 0, 0);
for (let i = 0; i < grass.count; ++i) {
    dummy.position.set(0, i / (5 * grass.count), 0);
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
    grass.setColorAt(i, new THREE.Color(0.25, 0.25 + i / (2 * grass.count), 0));
}

env.foreground.add(grass);

forest.ground.renderOrder = 0;
grass.renderOrder = 1;

env.timer.addTickHandler((evt) => {
    for (let i = 0; i < grass.count; ++i) {
        dummy.position.set(0.08 + 0.05 * Math.cos(evt.t / 1000) * i / grass.count, i / (5 * grass.count), 0);
        dummy.updateMatrix();
        grass.setMatrixAt(i, dummy.matrix);
    }
    grass.instanceMatrix.needsUpdate = true;
});

await env.fadeIn();