import { title } from "@juniper-lib/dom/attrs";
import { border, em, height, width } from "@juniper-lib/dom/css";
import { elementApply, elementSetDisplay, elementSetText, IFrame } from "@juniper-lib/dom/tags";
import { DialogBox } from "@juniper-lib/widgets/DialogBox";

export class FileDetailDialog extends DialogBox {
    private readonly iframe: HTMLIFrameElement;

    constructor() {
        super("File detail");

        elementSetDisplay(this.cancelButton, false);
        elementSetText(this.confirmButton, "Close");

        elementApply(this.contentArea,
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
