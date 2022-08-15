import { Div, ErsatzElement } from "@juniper-lib/dom/tags";
import type { Environment } from "@juniper-lib/threejs/environment/Environment";

export class Editor implements ErsatzElement {
    readonly element = Div();
    constructor(private readonly env: Environment) {
        console.log(this.env);
    }
}