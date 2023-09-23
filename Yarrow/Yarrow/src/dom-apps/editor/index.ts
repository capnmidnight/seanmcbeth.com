import { height, perc, width } from "@juniper-lib/dom/css";
import { elementApply, getElement } from "@juniper-lib/dom/tags";
import { createFetcher } from "../../createFetcher";
import { createDataLogger } from "../../settings";
import { EditorView } from "./EditorView";

import "./styles.css";

const fetcher = createFetcher();
const logger = createDataLogger(fetcher);
const editor = new EditorView(fetcher, logger);

elementApply(
    getElement("#layoutForm"),
    width(perc(100)),
    height(perc(100)),
    editor);

Object.assign(window, { editor });