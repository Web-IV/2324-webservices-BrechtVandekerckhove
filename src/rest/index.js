const Router = require("@koa/router");
const installBestellingenRouter = require("./bestellingen");
const installSuggestiesRouter = require("./suggesties");
const installHealthRoutes = require("./health");

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installBestellingenRouter(router);
  installSuggestiesRouter(router);
  installHealthRoutes(router);


  app.use(router.routes()).use(router.allowedMethods());
};
