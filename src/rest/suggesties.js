const Router = require("@koa/router");
const suggestiesService = require("../service/suggesties");

const getAllSuggesties = async (ctx) => {
  const { maand, vegie } = ctx.query;

  if (maand && vegie) {
    ctx.body = await suggestiesService.getByMaandEnVegie(
      Number(maand),
      vegie === "true"
    );
  } else {
    ctx.body = await suggestiesService.getAll();
  }
};


/**
 * Install routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/suggesties",
  });

  router.get("/", getAllSuggesties);

  app.use(router.routes()).use(router.allowedMethods());
};
