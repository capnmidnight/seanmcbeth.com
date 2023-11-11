export function runAnimation(update: (dt: number, t: number) => void): void {
    let lt = 0;
    requestAnimationFrame(t => {
        t *= 0.001;
        lt = t;
        requestAnimationFrame(doFrame);
    });

    function doFrame(t: number) {
        t *= 0.001;
        const dt = t - lt;
        lt = t;
        requestAnimationFrame(doFrame);
        update(dt, t);
    }
}
