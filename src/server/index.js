const appServer = require("./express");
const startServer = require("marigold-build/starters/server");

startServer({
  secure: false,
  mode: "production",
  express: appServer
});
