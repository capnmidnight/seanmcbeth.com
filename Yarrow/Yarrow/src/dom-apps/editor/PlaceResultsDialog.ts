import { ClassName, Src, Title_attr } from "@juniper-lib/dom/dist/attrs";
import { onClick } from "@juniper-lib/dom/dist/evts";
import {
    ButtonPrimarySmall,
    Div,
    HtmlRender,
    Img,
    elementClearChildren,
    elementSetDisplay
} from "@juniper-lib/dom/dist/tags";
import { DialogBox } from "@juniper-lib/widgets/dist/DialogBox";

import "./PlaceResultsDialog.css";

export class PlaceResultsDialog extends DialogBox {
    private readonly results: HTMLDivElement;

    constructor() {
        super("Map results");

        this.element.classList.add("places-results");

        elementSetDisplay(this.confirmButton, false);

        HtmlRender(this.contentArea,
            Div(
                ClassName("table"),
                Div(
                    ClassName("table-head"),
                    Div(
                        ClassName("table-row"),
                        Div(ClassName("table-cell")),
                        Div(ClassName("table-cell"), "Name"),
                        Div(ClassName("table-cell"), "Address"),
                        Div(ClassName("table-cell"))
                    )
                ),

                this.results = Div(
                    ClassName("table-body"),
                    Div(
                        ClassName("table-row"),
                        Div(
                            ClassName("table-cell"),
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
        HtmlRender(this.results, ...results.map(r =>
            Div(ClassName("table-row"),
                Div(ClassName("table-cell"),
                    Img(ClassName("thumbnail"),
                        Title_attr("Place icon"),
                        Src(r.icon))),
                Div(ClassName("table-cell"), r.name),
                Div(ClassName("table-cell"), r.formatted_address),
                Div(ClassName("table-cell"),
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
