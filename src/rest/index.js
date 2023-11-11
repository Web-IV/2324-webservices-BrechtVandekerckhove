const Router = require("@koa/router");

const installBestellingenRouter = require("./bestellingen");
const installSuggestiesRouter = require("./suggesties");
const installDienstenRouter = require("./diensten");
const installMedewerkersRouter = require("./medewerkers");  
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
  installDienstenRouter(router)
  installMedewerkersRouter(router);
  installHealthRoutes(router);


  app.use(router.routes()).use(router.allowedMethods());
};
