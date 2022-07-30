(function (self: ServiceWorkerGlobalScope) {
    function log(evtName: keyof ServiceWorkerGlobalScopeEventMap) {
        self.addEventListener(evtName, console.log.bind(console, evtName));
    }

    log("install");
    log("activate");
    log("error");

    self.addEventListener("install", async () => {
        await self.skipWaiting();
        console.log("Installed");
    });
})(self as unknown as ServiceWorkerGlobalScope);
