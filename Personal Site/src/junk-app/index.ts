import { Image_Png } from "@juniper-lib/mediatypes";
import { createFetcher } from "../createFetcher";

const fetcher = createFetcher();
const logos = [
    "foxglove",
    "juniper",
    "marigold",
    "poplar",
    "primrose",
    "wormwood"
];

(async function () {
    const responses = await Promise.all(logos.map(logo =>
        fetcher.get(`/img/logo_${logo}.min.png`)
            .image(Image_Png)));
    const images = responses.map(response => response.content);
    document.body.append(...images);
})();