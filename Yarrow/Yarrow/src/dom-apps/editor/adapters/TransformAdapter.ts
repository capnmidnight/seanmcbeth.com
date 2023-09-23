import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { y2g } from "@juniper-lib/google-maps/conversion";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { BaseScenarioFileAssetData, TransformData } from "../../../vr-apps/yarrow/data";
import { Transform } from "../../../vr-apps/yarrow/Transform";
import { EditableScenario } from "../EditableScenario";
import { EditableScenarioObjectMovedEvent } from "../EditableScenarioObjectMovedEvent";

interface TransformCreateInput {
    name: string;
    matrix: number[],
    parentTransformID: number;
}

export class TransformAdapter {
    constructor(private readonly scenario: EditableScenario) {
    }

    async create(parentTransformID: number, name: string, matrix: number[]): Promise<TransformData> {
        const data: TransformCreateInput = {
            parentTransformID,
            name,
            matrix
        };

        return await this.scenario.postFor<TransformData>("Create", "Transforms", data)
            .then(unwrapResponse);
    }

    private getChangedMatrices(transform: Transform) {

        const transforms = [transform];

        transform.traverse(c => {
            if (c instanceof Transform) {
                c.updateMatrixWorld();
                transforms.push(c);
            }
        });

        return transforms.map(transform => {
            return {
                transformID: transform.transformID,
                matrix: transform.matrixWorld.toArray()
            };
        });
    }

    saveMatrixThrottled(transform: Transform): void {
        const changes = this.getChangedMatrices(transform);
        for (const newData of changes) {
            this.scenario.throttle(`saveTransformPosition::${newData.transformID}`, () =>
                this.scenario.post("Move", "Transforms", newData));
        }
    }

    async saveMatrix(transform: Transform): Promise<void> {
        const changes = this.getChangedMatrices(transform);
        await Promise.all(changes.map(newData =>
            this.scenario.post("Move", "Transforms", newData)));
    }

    updateMarker(transform: Transform, markerFileAsset: BaseScenarioFileAssetData) {
        if (isDefined(markerFileAsset)) {
            const latLng = this.scenario.getTransformPosition(transform.transformID);
            const marker = this.scenario.fileMarkers.get(transform.transformID);
            marker.setPosition(y2g(latLng));
            this.scenario.dispatchEvent(new EditableScenarioObjectMovedEvent(markerFileAsset));
        }
    }
}
