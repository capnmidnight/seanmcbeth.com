import { className, src, title } from "@juniper-lib/dom/attrs";
import { onClick } from "@juniper-lib/dom/evts";
import {
    ButtonPrimarySmall,
    Div,
    elementApply,
    elementClearChildren,
    elementSetDisplay,
    Img
} from "@juniper-lib/dom/tags";
import { DialogBox } from "@juniper-lib/widgets/DialogBox";

import "./PlaceResultsDialog.css";

export class PlaceResultsDialog extends DialogBox {
    private readonly results: HTMLDivElement;

    constructor() {
        super("Map results");

        this.element.classList.add("places-results");

        elementSetDisplay(this.confirmButton, false);

        elementApply(this.contentArea,
            Div(
                className("table"),
                Div(
                    className("table-head"),
                    Div(
                        className("table-row"),
                        Div(className("table-cell")),
                        Div(className("table-cell"), "Name"),
                        Div(className("table-cell"), "Address"),
                        Div(className("table-cell"))
                    )
                ),

                this.results = Div(
                    className("table-body"),
                    Div(
                        className("table-row"),
                        Div(
                            className("table-cell"),
                            "Searching..."
                        )
                    )
                )
            )
        );
    }

    async selectResult(results: google.maps.places.PlaceResult[]): Promise<google.maps.places.PlaceResult> {
        let selection: google.maps.places.PlaceResult = null;
        elementClearChildren(this.results);
        elementApply(this.results, ...results.map(r =>
            Div(className("table-row"),
                Div(className("table-cell"),
                    Img(className("thumbnail"),
                        title("Place icon"),
                        src(r.icon))),
                Div(className("table-cell"), r.name),
                Div(className("table-cell"), r.formatted_address),
                Div(className("table-cell"),
                    ButtonPrimarySmall(
                        "Select",
                        onClick(() => {
                            selection = r;
                            this.confirmButton.click();
                        })
                    )
                )
            )
        ));

        if (await this.showDialog()) {
            return selection;
        }
        else {
            return null;
        }
    }
}
