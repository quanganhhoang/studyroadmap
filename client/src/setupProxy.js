// restart server whenever we make changes to this file
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api/*", "/auth/google/callback"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};