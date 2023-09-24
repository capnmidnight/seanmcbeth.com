import { HtmlRender, H3 } from "@juniper-lib/dom/dist/tags";
import { DockCell, DockGroupColumn, DockGroupRow, DockPanel, rearrangeable, resizable } from "@juniper-lib/widgets/dist/DockPanel";

import "./styles.css";


HtmlRender("main",
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
