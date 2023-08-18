import { Query } from "@juniper-lib/dom/attrs";
import { Main } from "@juniper-lib/dom/tags";
import { TipBox } from "@juniper-lib/widgets/TipBox";

Main(
    Query("main"),
    TipBox("boxB",
        "Don't take any wooden nickels",
        "Buy low, sell high",
        "If you get tired, take a nap"
    )
);