const Router = require("@koa/router");
const medewerkerService = require("../service/medewerkers");
const Joi = require("joi");
const validate = require("../core/validation");


const getAllMedewerkers = async (ctx) => {
  ctx.body = await medewerkerService.getAll();
};
medewerkerService.validationScheme = null;

const register = async (ctx) => {
  const medewerker = await medewerkerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = medewerker;
};
register.validationScheme = {
  body: {
    naam: Joi.string().max(191),
    voornaam: Joi.string().max(191),
    email: Joi.string().email().max(191),
    wachtwoord: Joi.string(),
    dienst: Joi.string().max(191),
  },
};

const getMedewerkerById = async (ctx) => {
  const medewerker = await medewerkerService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = medewerker;
};
getMedewerkerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateMedewerkerById = async (ctx) => {
  const medewerker = await medewerkerService.updateById(
    ctx.params.id,
    ctx.request.body
  );
  ctx.status = 200;
  ctx.body = medewerker;
};
updateMedewerkerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().max(191),
    voornaam: Joi.string().max(191),
    email: Joi.string().email().max(191),
    wachtwoord: Joi.string(),
    dienst: Joi.string().max(191),
  },
};

const deleteMedewerkerById = async (ctx) => {
  await medewerkerService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteMedewerkerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};
/**
 * Install routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/medewerkers",
  });

  router.get(
    "/",
    validate(getAllMedewerkers.validationScheme),
    getAllMedewerkers
  );
  router.get(
    "/:id",
    validate(getMedewerkerById.validationScheme),
    getMedewerkerById
  );
  router.post("/register", validate(register.validationScheme), register);
  router.put(
    "/:id",
    validate(updateMedewerkerById.validationScheme),
    updateMedewerkerById
  );
  router.delete(
    "/:id",
    validate(deleteMedewerkerById.validationScheme),
    deleteMedewerkerById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
