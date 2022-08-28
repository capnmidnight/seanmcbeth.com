import { gap, height, width } from "@juniper-lib/dom/css";
import { elementApply, H3 } from "@juniper-lib/dom/tags";
import { DockCell, DockColumn, DockPanel, DockRow } from "@juniper-lib/widgets/DockPanel";


elementApply(document.body.querySelector("main"),
    DockPanel(
        "Test",
        "resizable",
        "rearrangeable",
        width("100%"),
        height("90vh"),
        gap("3px"),
        DockRow(
            DockColumn(
                DockCell(
                    H3("C1"),
                    "Lorem ipsum"
                ),
                DockCell(
                    H3("C2"),
                    "Dolore sit amet"
                )
            ),
            DockCell(
                H3("C3"),
                "Bake me pies"
            ),
            DockCell(
                H3("C4"),
                "Bake me sweet little pies"
            )
        )
    )
);
