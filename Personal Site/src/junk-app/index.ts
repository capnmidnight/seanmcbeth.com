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
]

Promise.all(logos.map(logo =>
    fetcher.get(`/img/logo_${logo}.min.png`)
        .image(Image_Png)))
    .then(responses => responses.map(response => response.content))
    .then(images => document.body.append(...images));