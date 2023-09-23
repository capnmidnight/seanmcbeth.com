import { globeShowingAmericas, questionMark, star } from "@juniper-lib/emoji";
import type { PhotosphereMetadata, StationData } from "../../vr-apps/yarrow/data";
import { EditableScenario } from "./EditableScenario";

export function makeSphereName(scenario: EditableScenario, s: PhotosphereMetadata | StationData) {
    let name: string = null;

    if (!scenario) {
        name = questionMark.emojiStyle;
    }
    else if (scenario.startStationID
        && scenario.startStation.fileID === s.fileID) {
        name = star.emojiStyle;
    }
    else {
        name = globeShowingAmericas.emojiStyle;
    }

    name += ' ' + s.fileName;
    return name;
}

export function makeMarkerPath(name: string) {
    return `/images/markers/${name}.png`;
}