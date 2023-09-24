import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { IResponse } from "@juniper-lib/fetcher/dist/IResponse";
import { translateResponse } from "@juniper-lib/fetcher/dist/translateResponse";
import type { IProgress } from "@juniper-lib/progress/dist/IProgress";
import type { PhotosphereMetadata } from "../../vr-apps/yarrow/data";

export class GSVMetadata {
    constructor(protected fetcher: IFetcher) {
    }

    getGSV(fileID: number): Promise<IResponse<PhotosphereMetadata>> {
        return this.fetcher
            .get(`/Editor/Photospheres/${fileID.toFixed(0)}`)
            .object<PhotosphereMetadata>();
    }

    searchGSV(pano: string): Promise<IResponse<PhotosphereMetadata>> {
        return this.fetcher
            .get(`/Editor/Photospheres/Search/${pano}`)
            .object<PhotosphereMetadata>();
    }

    requestGSV(pano: string): Promise<IResponse<PhotosphereMetadata>> {
        return this.fetcher
            .get(`/Editor/Google/StreetView/Metadata/${pano}/`)
            .object<PhotosphereMetadata>();
    }

    async uploadGSV(file: Blob, fileName: string, pano: string, latitude: number, longitude: number, copyright: string, date: string, prog?: IProgress): Promise<IResponse<number>> {
        const form = new FormData();
        form.append("FormFile", file, fileName);
        form.append("Pano", pano);
        form.append("Latitude", latitude.toFixed(10));
        form.append("Longitude", longitude.toFixed(10));
        form.append("Copyright", copyright);
        form.append("Date", date);
        const id = await this.fetcher
            .post("/Editor/Photospheres/Create/")
            .body(form)
            .progress(prog)
            .object<number>();
        return id;
    }

    async replaceGSV(id: number, file: Blob, fileName: string, pano: string, latitude: number, longitude: number, copyright: string, date: string, prog?: IProgress): Promise<IResponse<number>> {
        const form = new FormData();
        form.append("FormFile", file, fileName);
        form.append("Pano", pano);
        form.append("Latitude", latitude.toFixed(10));
        form.append("Longitude", longitude.toFixed(10));
        form.append("Copyright", copyright);
        form.append("Date", date);
        const response = await this.fetcher
            .post(`/Editor/Photospheres/Update/${id}`)
            .body(form)
            .progress(prog)
            .exec();

        return translateResponse(response, () => id);
    }
}