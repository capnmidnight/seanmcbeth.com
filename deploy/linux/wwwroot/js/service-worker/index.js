// src/service-worker/index.ts
(function(self2) {
  function log(evtName) {
    self2.addEventListener(evtName, console.log.bind(console, evtName));
  }
  log("install");
  log("activate");
  log("error");
  self2.addEventListener("install", async () => {
    await self2.skipWaiting();
    console.log("Installed");
  });
})(self);
//# sourceMappingURL=index.js.map
