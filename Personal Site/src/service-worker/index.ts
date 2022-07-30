import { Fetcher, FetchingService, FetchingServiceImplFetch } from "@juniper-lib/fetcher";

(function (self: ServiceWorkerGlobalScope) {
    function log(evtName: keyof ServiceWorkerGlobalScopeEventMap) {
        self.addEventListener(evtName, console.log.bind(console, evtName));
    }

    const fetcher = new Fetcher(new FetchingService(new FetchingServiceImplFetch()));


    log("install");
    log("activate");
    log("error");

    self.addEventListener("install", async () => {
        await self.skipWaiting();
        console.log("Installed");
    });

    self.addEventListener("fetch", async (evt) => {
        if (evt.request.method !== "GET") {
            return;
        }

        evt.respondWith(fetcher
            .get(evt.request.url)
            .headers(evt.request.headers)
            .useCache(true)
            .blob()
            .then((response) => new Response(response.content, {
                headers: Array.from(response.headers.entries()),
                status: response.status
            })));
    });
})(self as unknown as ServiceWorkerGlobalScope);
