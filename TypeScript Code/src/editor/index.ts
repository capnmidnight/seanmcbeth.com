import { elementApply } from "@juniper-lib/dom/tags";
import { createTestEnvironment } from "../createTestEnvironment";
import { Editor } from "./Editor";

export default async function loadEditor() {
    const env = await createTestEnvironment();
    const editor = new Editor(env);
    elementApply("main", editor);
    Object.assign(window, { editor });
}