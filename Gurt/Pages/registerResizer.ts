export function registerResizer(canvas: HTMLCanvasElement) {
    let doResize = false;
    function resize() {
        canvas.width = devicePixelRatio * canvas.clientWidth;
        canvas.height = devicePixelRatio * canvas.clientHeight;
        doResize = false;
    }
    const resizer = new ResizeObserver((evts) => {
        for (const evt of evts) {
            if (evt.target === canvas) {
                if (!doResize) {
                    doResize = true;
                    queueMicrotask(resize);
                }
            }
        }
    });
    resizer.observe(canvas);
}
