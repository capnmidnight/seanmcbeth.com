import { Asset } from "@juniper-lib/fetcher";
import { createTestEnvironment } from "../createTestEnvironment";
import { Forest } from "../forest-app/Forest";

const env = await createTestEnvironment();
await env.fadeOut();

const forest = new Forest(env);
const [spatter] = await forest.load(new Asset("/img/spatter.png", forest.getPng));
forest.water.renderOrder = 0;
forest.ground.renderOrder = 1;
forest.trees.removeFromParent(); // another instancedmesh, removed for debugging

const grassGeom = new THREE.PlaneBufferGeometry(5, 5, 1, 1);
const grassTex = new THREE.CanvasTexture(spatter.result);
const grass = new Array<THREE.Mesh>(25);

for (let i = 0; i < grass.length; ++i) {
    const grassMat = new THREE.MeshStandardMaterial({
        map: grassTex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        color: new THREE.Color(0.25, 0.25 + i / (2 * grass.length), 0)
    });

    grass[i] = new THREE.Mesh(grassGeom, grassMat);
    grass[i].position.set(0, i / (5 * grass.length), 0);
    grass[i].rotation.set(Math.PI / 2, 0, 0);
    grass[i].updateMatrix();
    grass[i].renderOrder = 3 + i;
    env.foreground.add(grass[i]);
}

env.timer.addTickHandler((evt) => {
    for (let i = 0; i < grass.length; ++i) {
        grass[i].position.set(0.08 + 0.05 * Math.cos(evt.t / 1000) * i / grass.length, i / (5 * grass.length), 0);
    }
});

await env.fadeIn();