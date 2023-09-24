import { Query } from "@juniper-lib/dom/dist/attrs";
import { Main } from "@juniper-lib/dom/dist/tags";
import { TipBox } from "@juniper-lib/widgets/dist/TipBox";

Main(
    Query("main"),
    TipBox("boxB",
        "Don't take any wooden nickels",
        "Buy low, sell high",
        "If you get tired, take a nap"
    )
);