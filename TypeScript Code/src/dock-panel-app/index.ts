import { elementApply, H3 } from "@juniper-lib/dom/tags";
import { DockCell, DockGroupColumn, DockGroupRow, DockPanel, rearrangeable, resizable } from "@juniper-lib/widgets/DockPanel";

import "./styles.css";


elementApply(document.body.querySelector("main"),
    DockPanel(
        "Test",
        resizable(true),
        rearrangeable(true),
        DockGroupRow(
            DockGroupColumn(
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