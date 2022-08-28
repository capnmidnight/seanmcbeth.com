import { backgroundColor, border, borderRadius, gridGap, height, rule, width } from "@juniper-lib/dom/css";
import { elementApply, H3, Style } from "@juniper-lib/dom/tags";
import { DockCell, DockGroupColumn, DockPanel, DockGroupRow, rearrangeable, resizable } from "@juniper-lib/widgets/DockPanel";

Style(
    rule(".dock.panel",
        width("100%"),
        height("90vh")
    ),

    rule(".dock.cell",
        border("1px solid black"),
        borderRadius("5px"),
        backgroundColor("#ccc")
    ),

    rule(".dock.cell > .content",
        backgroundColor("#fff")
    )
);

elementApply(document.body.querySelector("main"),
    DockPanel(
        "Test",
        resizable(true),
        rearrangeable(true),
        gridGap("3px"),
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
