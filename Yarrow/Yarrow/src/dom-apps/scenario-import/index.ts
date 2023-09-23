import { documentReady } from "@juniper-lib/dom/documentReady";
import { buttonSetEnabled, elementApply, elementSetText, getInput, H2, P } from "@juniper-lib/dom/tags";
import { assertSuccess } from "@juniper-lib/fetcher/assertSuccess";
import { Application_X_Zip_Compressed, Application_Zip } from "@juniper-lib/mediatypes";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { BootstrapProgressBar } from "@juniper-lib/widgets/BootstrapProgressBar";
import { DialogBox } from "@juniper-lib/widgets/DialogBox";
import { FileUploadInput } from "@juniper-lib/widgets/FileUploadInput";
import { createFetcher } from "../../createFetcher";

class LoadingDialog extends DialogBox {
    private readonly statusMessage: HTMLParagraphElement;
    readonly progressBar: IProgress;

    constructor() {
        super("Scenario Importing...");

        elementApply(this.contentArea,
            H2("Please wait"),
            P("Importing scenarios takes a significant amount of time. Please do not close the window before the import completes."),
            this.statusMessage = P("Uploading..."),
            this.progressBar = BootstrapProgressBar()
        );
        this.cancelButton.remove();
        buttonSetEnabled(this.confirmButton, false, "OK", "Close dialog");
    }

    success() {
        elementSetText(this.statusMessage, "Upload completed successfully!");
        buttonSetEnabled(this.confirmButton, true, "OK", "Close dialog");
    }

    fail(err: any) {
        console.error(err);
        elementSetText(this.statusMessage, "Upload failed!");
        buttonSetEnabled(this.confirmButton, true, "OK", "Close dialog");
    }
}

(async function () {   
    await documentReady;
    const fetcher = createFetcher(false);
    const dialog = new LoadingDialog();
    const fileUpload = new FileUploadInput("Import", "danger", getInput("#scenarioPackageFile"));
    fileUpload.setTypeFilters(Application_X_Zip_Compressed, Application_Zip);

    fileUpload.addEventListener("input", async (evt) => {
        dialog.progressBar.start("Uploading...");
        fileUpload.enabled = false;
        const dialogTask = dialog.showDialog();
        try {
            const form = new FormData();
            form.set("FormFile", evt.files[0]);
            const response = await fetcher.post("/editor/scenarios/")
                .query("handler", "Import")
                .body(form)
                .progress(dialog.progressBar)
                .exec();
            assertSuccess(response);
            dialog.success();
            globalThis.location.href = response.responsePath;
        }
        catch (exp) {
            dialog.fail(exp);
        }
        finally {
            await dialogTask;
            location.reload();
        }        
    });

})();