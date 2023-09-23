import { elementApply } from "@juniper-lib/dom/tags";
import { ClockImage } from "@juniper-lib/graphics2d/ClockImage";
import { StatsImage } from "@juniper-lib/graphics2d/StatsImage";

const clock = new ClockImage();
const stats = new StatsImage();

elementApply("main", clock, stats);

setTimeout(() =>
    stats.setStats(50, 25, 1337),
    2000);