export function runAnimation(update: (dt: number, t: number) => void): void {
    let lt = 0;
    requestAnimationFrame(t => {
        lt = t;
        requestAnimationFrame(doFrame);
    });

    function doFrame(t: number) {
        let dt = t - lt;
        lt = t;
        requestAnimationFrame(doFrame);
        update(dt, t);
    }
}
