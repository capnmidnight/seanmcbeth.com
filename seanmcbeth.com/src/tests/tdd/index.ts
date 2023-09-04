import { Query } from "@juniper-lib/dom/attrs";
import { fontSize, maxWidth } from "@juniper-lib/dom/css";
import { Main } from "@juniper-lib/dom/tags";
import { TestOutputHTML } from "@juniper-lib/testing/tdd/TestOutputHTML";
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