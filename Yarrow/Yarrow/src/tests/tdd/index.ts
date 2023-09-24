import { HtmlRender } from "@juniper-lib/dom/dist/tags";
import { TestOutputHTML } from "@juniper-lib/testing/dist/tdd/TestOutputHTML";
import { tests as JuniperTests } from "@juniper-lib/tests/dist";

const output = new TestOutputHTML(
    ...JuniperTests
);

HtmlRender("main", output);

output.run("UTMPointTests");