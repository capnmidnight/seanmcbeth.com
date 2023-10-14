export interface GameObject extends HTMLElement {
    update(dt: number): void;
    render(): void;
    get x(): number;
}
