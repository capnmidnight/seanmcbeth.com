import { height, perc, width } from "@juniper-lib/dom/dist/css";
import { HtmlRender, getElement } from "@juniper-lib/dom/dist/tags";
import { createFetcher } from "../../createFetcher";
import { createDataLogger } from "../../settings";
import { EditorView } from "./EditorView";

import "./styles.css";

const fetcher = createFetcher();
const logger = createDataLogger(fetcher);
const editor = new EditorView(fetcher, logger);

HtmlRender(
    getElement("#layoutForm"),
    width(perc(100)),
    height(perc(100)),
    editor);

Object.assign(window, { editor });