const Router = require("@koa/router");
const dienstenService = require("../service/diensten");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");

const getAllDiensten = async (ctx) => {
  ctx.body = await dienstenService.getAll();
};
getAllDiensten.validationScheme = null;
/**
 * Install routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/diensten",
  });

  router.get(
    "/",
    validate(getAllDiensten.validationScheme),
    requireAuthentication,
    getAllDiensten
  );

  app.use(router.routes()).use(router.allowedMethods());
};
