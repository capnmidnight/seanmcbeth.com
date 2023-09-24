import { TypedEvent } from "@juniper-lib/events/dist/EventBase";
import type { BaseScenarioFileAssetData } from "../../vr-apps/yarrow/data";

export class EditableScenarioObjectMovedEvent extends TypedEvent<"objectmoved"> {
    constructor(public readonly object: BaseScenarioFileAssetData) {
        super("objectmoved");
    }
}
