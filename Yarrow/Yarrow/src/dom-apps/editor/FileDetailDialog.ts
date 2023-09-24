import { title } from "@juniper-lib/dom/dist/attrs";
import { border, em, height, width } from "@juniper-lib/dom/dist/css";
import { HtmlRender, elementSetDisplay, elementSetText, IFrame } from "@juniper-lib/dom/dist/tags";
import { DialogBox } from "@juniper-lib/widgets/dist/DialogBox";

export class FileDetailDialog extends DialogBox {
    private readonly iframe: HTMLIFrameElement;

    constructor() {
        super("File detail");

        elementSetDisplay(this.cancelButton, false);
        elementSetText(this.confirmButton, "Close");

        HtmlRender(this.contentArea,
            this.iframe = IFrame(
                border("none"),
                width(em(40)),
                height(em(50)),
                title("File detail")
            )
        );
    }

    async showFile(fileID: number): Promise<void> {
        this.iframe.src = `/Editor/Files/Detail/${fileID}?hideBanner`;
        await this.showDialog();
    }
}
