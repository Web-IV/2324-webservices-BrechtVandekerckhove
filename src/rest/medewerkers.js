const Router = require("@koa/router");
const Joi = require("joi");

const medewerkerService = require("../service/medewerkers");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/rollen");

const getAllMedewerkers = async (ctx) => {
  ctx.body = await medewerkerService.getAll();
};
medewerkerService.validationScheme = null;

const register = async (ctx) => {
  const tokenEnMedewerker = await medewerkerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = tokenEnMedewerker;
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

const login = async (ctx) => {
  const { email, wachtwoord } = ctx.request.body;
  const token = await medewerkerService.login(email, wachtwoord);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().email().max(191),
    wachtwoord: Joi.string(),
  },
};

/**
 * Check if the signed in user can access the given user's information.
 */
const checkMedewerkerId = (ctx, next) => {
  const { medewerkerId, rollen } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== medewerkerId && !rollen.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "Je bent niet gemachtigd om de gegevens van deze gebruiker te bekijken.",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

/**
 * Install routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installMedewerkersRoutes(app) {
  const router = new Router({
    prefix: "/medewerkers",
  });
  //publieke routes
  router.post("/register", validate(register.validationScheme), register);
  router.post("/login", validate(login.validationScheme), login);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  //Routes met authenticatie/authorisatie
  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllMedewerkers.validationScheme),
    getAllMedewerkers
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getMedewerkerById.validationScheme),
    checkMedewerkerId,
    getMedewerkerById
  );

  router.put(
    "/:id",
    requireAuthentication,
    validate(updateMedewerkerById.validationScheme),
    checkMedewerkerId,
    updateMedewerkerById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteMedewerkerById.validationScheme),
    checkMedewerkerId,
    deleteMedewerkerById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
