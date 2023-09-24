import { HtmlRender } from "@juniper-lib/dom/dist/tags";
import { ClockImage } from "@juniper-lib/graphics2d/dist/ClockImage";
import { StatsImage } from "@juniper-lib/graphics2d/dist/StatsImage";

const clock = new ClockImage();
const stats = new StatsImage();

HtmlRender("main",
    clock.canvas as HTMLCanvasElement,
    stats.canvas as HTMLCanvasElement
);

setTimeout(() =>
    stats.setStats(50, 25, 1337),
    2000);