import { Environment } from "@juniper-lib/threejs/environment/Environment";
import { obj } from "@juniper-lib/threejs/objects";
import { CanvasTexture, Color, DoubleSide, InstancedMesh, MeshBasicMaterial, PlaneGeometry } from "three";

export function makeGrass(env: Environment, spatter: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap): void {
    const grassGeom = new PlaneGeometry(5, 5, 1, 1);
    const grassTex = new CanvasTexture(spatter);
    const grassMat = new MeshBasicMaterial({
        map: grassTex,
        transparent: true,
        opacity: 1,
        side: DoubleSide
    });

    const grass = new InstancedMesh(grassGeom, grassMat, 25);

    const dummy = obj("Dummy");
    dummy.rotation.set(Math.PI / 2, 0, 0);
    for (let i = 0; i < grass.count; ++i) {
        dummy.position.set(0, i / (5 * grass.count), 0);
        dummy.updateMatrix();
        grass.setMatrixAt(i, dummy.matrix);
        grass.setColorAt(i, new Color(0.25, 0.25 + i / (2 * grass.count), 0));
    }

    env.foreground.add(grass);

    env.timer.addTickHandler((evt) => {
        for (let i = 0; i < grass.count; ++i) {
            dummy.position.set(0.08 + 0.05 * Math.cos(evt.t / 1000) * i / grass.count, i / (5 * grass.count), 0);
            dummy.updateMatrix();
            grass.setMatrixAt(i, dummy.matrix);
        }
        grass.instanceMatrix.needsUpdate = true;
    });
}