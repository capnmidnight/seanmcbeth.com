import { ID } from "@juniper-lib/dom/attrs";
import { isModifierless } from "@juniper-lib/dom/evts";
import { Canvas, Div, elementApply } from "@juniper-lib/dom/tags";
import { playOrPauseButton } from "@juniper-lib/emoji";
import { TextImage, TextImageOptions } from "@juniper-lib/graphics2d/TextImage";
import { isMobileVR } from "@juniper-lib/tslib/flags";
import { usingAsync } from "@juniper-lib/tslib/using";
import { Avatar } from "@juniper-lib/webgl/Avatar";
import { Camera } from "@juniper-lib/webgl/Camera";
import { Context3D } from "@juniper-lib/webgl/Context3D";
import { Geometry } from "@juniper-lib/webgl/Geometry";
import { BaseMaterial } from "@juniper-lib/webgl/Material";
import { Mesh } from "@juniper-lib/webgl/Mesh";
import { RenderTargetManager } from "@juniper-lib/webgl/RenderTargetManager";
import { XRSessionManager } from "@juniper-lib/webgl/XRSessionManager";
import { invCube } from "@juniper-lib/webgl/geometry/cubes";
import { invPlane } from "@juniper-lib/webgl/geometry/plane";
import { TextureImage, TextureImageStereo } from "@juniper-lib/webgl/managed/resource/Texture";
import { MaterialEquirectangular } from "@juniper-lib/webgl/programs/MaterialEquirectangular";
import { MaterialFlatTexture } from "@juniper-lib/webgl/programs/MaterialFlatTexture";
import { mat4, vec3 } from "gl-matrix";
import { createFetcher } from "../../createFetcher";

const canvas = Canvas(
    ID("frontBuffer")
);

elementApply("main",
    Div(
        ID("appContainer"),
        canvas
    )
);

(async function () {

    const fetcher = createFetcher();
    const { content: skyboxImg } = await fetcher
        .get("/img/belmorepark.jpg")
        .imageBitmap();

    const ctx = new Context3D(canvas, {
        alpha: true,
        depth: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    const gl = ctx.gl;
    const cam = new Camera(ctx, {
        focalLength: 0.014
    });
    const avatar = new Avatar();
    const xrManager = new XRSessionManager(gl, cam);
    const emojiFont: Partial<TextImageOptions> = {
        textFillColor: "black",
        fontFamily: "sans-serif",
        fontSize: 20,
        minWidth: 0.25,
        maxWidth: 0.25,
        minHeight: 0.25,
        maxHeight: 0.25
    };
    const icon = new TextImage(emojiFont);

    xrManager.addEventListener("sessionended", () =>
        cam.fov = 50);

    window.addEventListener("pointermove", (evt) => {
        if (evt.buttons === 1) {
            avatar.setRotation(
                evt.movementX * 10,
                evt.movementY * 10);
        }
    });

    window.addEventListener("keydown", (evt) => {
        if (isModifierless(evt)) {
            avatar.addKey(evt.key);
        }
    });

    window.addEventListener("keyup", (evt) =>
        avatar.removeKey(evt.key));

    xrManager.addEventListener("sessionstarted", () =>
        avatar.reset());

    xrManager.addEventListener("sessionended", () =>
        avatar.reset());

    if (!navigator.xr) {
        console.warn("No WebXR");
    }
    else {
        const supportedSessions = await xrManager.getSessionModes();
        if (supportedSessions.length === 0) {
            console.warn("No supported session types");
        }
        else {
            const sessionType = supportedSessions[0];
            console.log(sessionType + " is supported. Hit <kbd>x</kbd> key.");
            window.addEventListener("keyup", (evt) => {
                if (isModifierless(evt)) {
                    if (evt.key === "Escape") {
                        if (xrManager.inSession) {
                            xrManager.endSession();
                        }
                        else {
                            xrManager.stopAnimation();
                        }
                    }
                    else if (evt.key === "x") {
                        if (xrManager.inSession) {
                            xrManager.endSession();
                        }
                        else {
                            xrManager.startSession(sessionType);
                        }
                    }
                }
            });

            if (isMobileVR()) {
                window.addEventListener("click", () => {
                    if (!xrManager.inSession) {
                        xrManager.startSession(sessionType);
                    }
                });
            }
        }
    }

    const materials = new Array<BaseMaterial>();
    const meshesByMaterial = new Map<BaseMaterial, Mesh[]>();

    const addMesh = (mesh: Mesh) => {
        if (!meshesByMaterial.has(mesh.material)) {
            materials.push(mesh.material);
            meshesByMaterial.set(mesh.material, new Array<Mesh>());
        }

        meshesByMaterial.get(mesh.material).push(mesh);
        return mesh;
    };

    icon.value = playOrPauseButton.emojiStyle;

    await usingAsync(new RenderTargetManager(gl), async (fbManager) => {

        ctx.addEventListener("resize", () =>
            fbManager.resize());

        xrManager.addEventListener("sessionstarted", (evt) =>
            fbManager.setSession(evt.session, evt.views));

        xrManager.addEventListener("sessionended", () =>
            fbManager.setSession(null));

        Object.assign(window, {
            ctx,
            xrManager,
            fbManager
        });

        await usingAsync(new MaterialFlatTexture(gl), async (flatMat) => {
            await usingAsync(new MaterialEquirectangular(gl), async (skyboxMat) => {
                await usingAsync(new Geometry(gl, invPlane), async (invPlane) => {
                    await usingAsync(new Geometry(gl, invCube), async (invCube) => {
                        await usingAsync(new TextureImage(gl, icon.canvas), async (iconTex) => {
                            await usingAsync(new TextureImageStereo(gl, skyboxImg), async (skyboxTex) => {
                                await usingAsync(skyboxTex, async (skyboxTex) => {
                                    const icon = addMesh(new Mesh(gl, invPlane, iconTex, flatMat));
                                    mat4.translate(icon.model, icon.model, vec3.set(vec3.create(), 0, 0, -2));
                                    mat4.scale(icon.model, icon.model, vec3.set(vec3.create(), 0.1, 0.1, 0.1));

                                    addMesh(new Mesh(gl, invCube, skyboxTex, skyboxMat));

                                    xrManager.addTickCallback((_t: number, dt: number, frame?: XRFrame) => {
                                        avatar.update(dt);

                                        if (xrManager.sessionType === "immersive-ar") {
                                            cam.rotateAndMoveTo(0, 0, avatar.position);
                                        }
                                        else if (xrManager.sessionType === "immersive-vr") {
                                            cam.rotateAndMoveTo(avatar.headingDegrees, 0, avatar.position);
                                        }
                                        else {
                                            cam.rotateAndMoveTo(avatar.headingDegrees, avatar.pitchDegrees, avatar.position);
                                        }

                                        fbManager.beginFrame();
                                        const gamma = 1 / cam.gamma;
                                        for (const [material, meshes] of meshesByMaterial) {
                                            let inUse = false;
                                            for (const mesh of meshes) {
                                                if (mesh.visible) {
                                                    if (!inUse) {
                                                        material.use();
                                                        material.setGamma(gamma);
                                                        inUse = true;
                                                    }
                                                    mesh.render(cam, frame, xrManager.baseRefSpace);
                                                }
                                            }
                                        }
                                        fbManager.endFrame();
                                    });

                                    xrManager.startAnimation();
                                    await xrManager.done;
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    canvas.remove();
    console.log("All done!");
})();