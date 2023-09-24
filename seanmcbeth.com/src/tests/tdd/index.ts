import { Query } from "@juniper-lib/dom/dist/attrs";
import { fontSize, maxWidth } from "@juniper-lib/dom/dist/css";
import { Main } from "@juniper-lib/dom/dist/tags";
import { TestOutputHTML } from "@juniper-lib/testing/dist/tdd/TestOutputHTML";
import { tests as JuniperTests } from "@juniper-lib/tests";

const output = new TestOutputHTML(
    ...JuniperTests
);

Main(
    Query("main"),
    maxWidth("unset"),
    fontSize("initial"),
    output
);
output.run("BinarySearchTests");