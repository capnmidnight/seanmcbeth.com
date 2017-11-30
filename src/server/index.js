const appServer = require("./express");
const startServer = require("marigold-server");

startServer({
  secure: false,
  mode: "production",
  express: appServer
});
