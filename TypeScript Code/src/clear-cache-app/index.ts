import { createFetcher } from "../createFetcher";

createFetcher(false)
    .clearCache()
    .then(() => {
        document.location = "forest-and-dirt";
    })