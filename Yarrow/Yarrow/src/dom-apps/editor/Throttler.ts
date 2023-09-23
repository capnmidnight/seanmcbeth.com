import { isDefined } from "@juniper-lib/tslib/typeChecks";

export class Throttler {

    private timer: number = null;
    private curTask: Promise<unknown> = null;
    private nextTask: () => Promise<unknown> = null;

    constructor(private readonly debounceSeconds: number = 0.25) {

    }

    throttle(callback: () => Promise<unknown>): void {
        if (isDefined(this.curTask)) {
            this.nextTask = callback;
        }
        else {
            if (isDefined(this.timer)) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = setTimeout(async () => {
                this.timer = null;
                this.run(callback);
            }, this.debounceSeconds * 1000) as any;
        }
    }

    private async run(callback: () => Promise<unknown>): Promise<void> {
        this.curTask = callback();
        await this.curTask;
        const next = this.nextTask;
        if (isDefined(next)) {
            this.nextTask = null;
            this.run(next);
        }
        else {
            this.curTask = null;
        }
    }
}