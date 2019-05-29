require("marigold-server")({
  express(appServer) {
    appServer.get("/test", function(req, res, next) {
      res.status(200).send("OK!");
    });
  }
});
