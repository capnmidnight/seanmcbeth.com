import { HtmlRender } from "@juniper-lib/dom/tags";
import { TypedEvent } from "@juniper-lib/events/TypedEventBase";
import { TestOutputHTML } from "@juniper-lib/testing/tdd/TestOutputHTML";
import { tests as JuniperTests } from "@juniper-lib/tests";

const output = new TestOutputHTML(
    ...JuniperTests
);

HtmlRender("main", output);

output.run("UTMPointTests");