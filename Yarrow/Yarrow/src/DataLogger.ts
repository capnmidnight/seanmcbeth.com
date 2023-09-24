import { IDataLogger } from "@juniper-lib/tslib/dist/IDataLogger";

export class DataLogger implements IDataLogger {
    constructor(public readonly log: (key: string, value?: object) => void) {
    }

    error(page: string, operation: string, exception?: any): void {
        console.error(page, operation, exception);
        this.log("error", {
            page,
            operation,
            exception
        });
    }
}
