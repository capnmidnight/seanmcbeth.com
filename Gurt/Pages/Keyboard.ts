export class Keyboard {
    private readonly keySet = new Set<string>();
    constructor() {
        window.addEventListener("keydown", evt => {
            this.keySet.add(evt.key);
        });

        window.addEventListener("keyup", evt => {
            this.keySet.delete(evt.key);
        });
    }

    has(key: string) {
        return this.keySet.has(key);
    }

    get shift() {
        return this.keySet.has("Shift") ? 1 : 0;
    }

    get vertical() {
        return this.keySet.has("ArrowUp") 
            ? 1 
            : this.keySet.has("ArrowDown") 
                ? -1 
                : 0;
    }

    get horizontal() {
        return this.keySet.has("ArrowRight")
            ? 1
            : this.keySet.has("ArrowLeft")
                ? -1
                : 0;
    }
}
