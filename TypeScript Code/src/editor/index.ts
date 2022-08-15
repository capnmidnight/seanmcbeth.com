import { elementApply } from "@juniper-lib/dom/tags";
import { createTestEnvironment } from "../createTestEnvironment";
import { Editor } from "./Editor";

export default async function loadEditor() {
    const env = await createTestEnvironment(false);
    const editor = new Editor(env);
    elementApply(document.body, editor);
    Object.assign(window, { editor });
}