const Router = require("@koa/router");
const suggestiesService = require("../service/suggesties");
const Joi = require("joi");
const validate = require("../core/validation");

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
getAllSuggesties.validationScheme = {
  query: {
    maand: Joi.number().integer().min(1).max(12).optional(),
    vegie: Joi.boolean().optional(),
  },
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

  router.get(
    "/",
    validate(getAllSuggesties.validationScheme),
    getAllSuggesties
  );

  app.use(router.routes()).use(router.allowedMethods());
};
