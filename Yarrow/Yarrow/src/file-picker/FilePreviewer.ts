import { JuniperAudioContext } from "@juniper-lib/audio/context/JuniperAudioContext";
import { AudioPlayer } from "@juniper-lib/audio/sources/AudioPlayer";
import { NoSpatializer } from "@juniper-lib/audio/spatializers/NoSpatializer";
import { classList, controls, src } from "@juniper-lib/dom/attrs";
import { canvasToBlob } from "@juniper-lib/dom/canvas";
import {
    Audio, Div,
    elementApply,
    elementClearChildren, Elements, ErsatzElement, H2,
    IFrame,
    Img,
    resolveElement, TextArea,
    Video
} from "@juniper-lib/dom/tags";
import type { IFetcher } from "@juniper-lib/fetcher/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { PDFImage } from "@juniper-lib/graphics2d/PDFImage";
import { Application_Javascript, Application_Json, Application_Pdf, Application_X_Url, Image_Png, Text_Html } from "@juniper-lib/mediatypes";
import { MediaTypeDB } from "@juniper-lib/mediatypes/db";
import { create } from "@juniper-lib/mediatypes/util";
import type { Environment } from "@juniper-lib/threejs/environment/Environment";
import { blobToObjectURL } from "@juniper-lib/tslib/blobToObjectURL";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/typeChecks";
import { formatBytes } from "@juniper-lib/tslib/units/fileSize";
import { VideoPlayer } from "@juniper-lib/video/VideoPlayer";
import { YouTubeProxy } from "@juniper-lib/video/YouTubeProxy";
import { YTMetadata } from "@juniper-lib/video/yt-dlp";
import { registerThumbnails } from "@juniper-lib/widgets/registerThumbnails";
import { getScriptUrl } from "../settings";
import { FileData, Video_Vnd_DlsDc_YtDlp_Json } from "../vr-apps/yarrow/data";
import { makeProxyURL } from "../vr-apps/yarrow/proxy";
import type { FileTypes } from "./models";

import "./FilePreviewer.css";

const anyAudio = create("audio", "*");
const anyImage = create("image", "*");
const anyText = create("text", "*");
const anyVideo = create("video", "*");

export class FilePreviewer
    implements ErsatzElement {
    private _hasFile: boolean;

    private readonly yt: YouTubeProxy;
    private readonly vid: VideoPlayer;
    private readonly aud: AudioPlayer;

    constructor(public readonly element: HTMLElement,
        private readonly fetcher: IFetcher,
        private readonly audioSys: JuniperAudioContext | Environment) {

        PDFImage.prepare(getScriptUrl("pdfjs"), fetcher, true);

        this.yt = new YouTubeProxy(this.fetcher, makeProxyURL);

        let context = this.audioSys;
        if (context instanceof JuniperAudioContext) {
            const no = new NoSpatializer(context.destination);
            this.vid = new VideoPlayer(context, no);
            this.aud = new AudioPlayer(context, no);
        }
        else {
            this.vid = new VideoPlayer(context.audio.context, context.audio.noSpatializer);
            this.aud = context.audioPlayer;
            context = context.audio.context;
        }

        const json = this.element.dataset.json;
        if (isDefined(json)) {
            const fileData: FileData = JSON.parse(json);
            this.setFile(fileData, ...fileData.tagsString.split(',').map(v => v.trim().toLowerCase()));
        }
    }

    get hasFile(): boolean {
        return this._hasFile;
    }

    showLoading() {
        this.setElement(Div("Loading"), "Loading", "Loading", null);
    }

    async setFile(file: FileTypes, ...classes: string[]): Promise<void> {
        this.showLoading();

        let path: string = null;
        let type: string = null;
        let name: string = null;
        let size: number = null;
        let metadata: YTMetadata = null;
        if (file instanceof URL) {
            // This is used while displaying the FilePicker
            // and the user has typed in a URL that they intend
            // to upload as a file reference.

            const response = await this.fetcher
                .get(makeProxyURL(file))
                .file();

            path = response.content;
            name = response.fileName ?? file.href;
            type = response.contentType;
            size = response.contentLength;
        }
        else if (file instanceof File) {
            // This is used while displaying the FilePicker
            // and the user has selected a file from their
            // file system that the intend to upload to the
            // database.
            path = URL.createObjectURL(file);
            name = file.name;
            type = file.type;
            size = file.size;
        }
        else {
            // All other examples will be file records in
            // our database already.
            path = file.filePath;
            name = file.name;
            type = file.mediaType;
            size = file.size;

            metadata = (file as any).metadata;
        }

        if (isNullOrUndefined(type) || type.length === 0) {
            // This should be fairly rare. Guessing the media type by
            // the file extension is error-prone (lots of potential
            // false positives, especially for anything ending in
            // .json or .mpeg), but if we don't have a file type
            // at all it's better than nothing.
            type = MediaTypeDB.normalizeFileType(name, type);
        }

        let element: Elements = null;
        if (Video_Vnd_DlsDc_YtDlp_Json.matches(type)) {
            const data = await this.yt.loadData(metadata || path);
            if (isNullOrUndefined(data.videos) || data.videos.length === 0) {
                element = await this.aud.load(data);
            }
            else {
                element = await this.vid.load(data);
            }
        }
        else if (Text_Html.matches(type)
            || Application_X_Url.matches(type)) {
            element = this.makeIFrame(path);
        }
        else if (Application_Pdf.matches(type)) {
            element = await this.makePDF(path);
        }
        else if (anyAudio.matches(type)) {
            element = this.makeAudio(path);
        }
        else if (anyVideo.matches(type)) {
            element = this.makeVideo(path);
        }
        else if (anyImage.matches(type)) {
            element = this.makeImage(path);
        }
        else if (anyText.matches(type)
            || Application_Json.matches(type)
            || Application_Javascript.matches(type)) {
            element = await this.makeText(path);
        }
        else {
            element = await this.makeUnknown(path);
        }

        this.setElement(element, type, name, size, ...classes);
    }

    clear(): void {
        elementClearChildren(this);
        this._hasFile = false;
    }

    private makeAudio(path: string): HTMLElement {
        return Audio(controls(true), src(path));
    }

    private makeVideo(path: string): HTMLElement {
        return Video(controls(true), src(path));
    }

    private async makeText(path: string): Promise<HTMLElement> {
        const txt = await this.fetcher
            .get(path)
            .text()
            .then(unwrapResponse);
        return TextArea(txt);
    }

    private async makePDF(path: string): Promise<HTMLElement> {
        const pdf = new PDFImage(path, {
            scale: 72 / 50
        });

        await pdf.getPage(0);
        const canvBlob = await canvasToBlob(pdf.canvas, Image_Png);
        const canvURL = blobToObjectURL(canvBlob);
        return Img(
            classList(
                "thumbnail",
                "image"
            ),
            src(canvURL));
    }

    private makeImage(path: string): HTMLElement {
        return Img(
            classList(
                "thumbnail",
                "image"
            ),
            src(path));
    }

    private makeUnknown(path: string): HTMLElement {
        return Div(`Cannot preview file at path: ${path}`)
    }

    private makeIFrame(path: string): HTMLElement {
        return IFrame(src(path));
    }

    private setElement(element: Elements, type: string, name: string, size: number, ...classes: string[]) {
        element = resolveElement(element);

        this._hasFile = element.tagName !== "DIV";
        elementClearChildren(this);
        elementApply(this,
            H2(name),
            Div(size && `${type}: ${formatBytes(size)}` || ''),
            elementApply(element,
                classList(...classes)
            )
        );

        if (element.tagName === "IMG" || element.tagName === "CANVAS") {
            registerThumbnails();
        }
    }
}

