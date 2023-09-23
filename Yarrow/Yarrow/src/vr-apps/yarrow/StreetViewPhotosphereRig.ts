import { CanvasTypes, createCanvasFromImage, createImageFromFile } from "@juniper-lib/dom/canvas";
import { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { PhotosphereCaptureResolution, PhotosphereRig } from "@juniper-lib/threejs/PhotosphereRig";
import { IProgress } from "@juniper-lib/progress/IProgress";

function getStreetViewImagePath(pano: string, fovDegrees: number, headingDegrees: number, pitchDegrees: number) {
    return `/Editor/Google/StreetView/Image/${pano}/${fovDegrees}/${headingDegrees}/${pitchDegrees}/`;
}

export interface IPhotosphereRig {
    init(baseURL: string, isDebug: boolean): void;
    loadImages(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<HTMLImageElement[]>;
    loadCanvas(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<CanvasTypes>;
}

export class StreetViewPhotosphereRig
    extends PhotosphereRig
    implements IPhotosphereRig {
    constructor(fetcher: IFetcher) {
        super(fetcher, true);
    }

    loadFiles(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<string[]> {
        return this.renderFaces(
            getStreetViewImagePath.bind(null, pano),
            level,
            progress);
    }

    loadFile(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<string> {
        return this.renderCubeMap(
            getStreetViewImagePath.bind(null, pano),
            level,
            progress);
    }

    async loadImages(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<HTMLImageElement[]> {
        const files = await this.loadFiles(pano, level, progress);
        return await Promise.all(files.map(createImageFromFile));
    }

    async loadCanvas(pano: string, level: PhotosphereCaptureResolution, progress?: IProgress): Promise<CanvasTypes> {
        const file = await this.loadFile(pano, level, progress);
        const img = await createImageFromFile(file);
        return createCanvasFromImage(img);
    }
}
