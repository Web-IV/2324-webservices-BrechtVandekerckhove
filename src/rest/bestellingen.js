const Router = require("@koa/router");
const Joi = require("joi");

const bestellingService = require("../service/bestellingen");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");
const Role = require("../core/rollen");

const getAllBestellingen = async (ctx) => {
  const { medewerkerId, rollen } = ctx.state.session;
  ctx.body = await bestellingService.getAll(medewerkerId, rollen);
};
getAllBestellingen.validationScheme = null;

const createBestelling = async (ctx) => {
  //medewerkerId toevoegen aan bestelling
  const { medewerkerId } = ctx.state.session;
  let bestelling = ctx.request.body;
  bestelling.medewerkerId = medewerkerId;
  const nieuweBestelling = await bestellingService.create(bestelling);
  ctx.body = nieuweBestelling;
  ctx.status = 201; //created
};

//voor validationScheme
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

createBestelling.validationScheme = {
  body: {
    maaltijden: Joi.array().items(
      Joi.object({
        type: Joi.string().valid("warmeMaaltijd", "broodMaaltijd"),
        hoofdschotel: Joi.string().max(191).allow(null).optional(),
        soep: Joi.string().valid("dagsoep", "geen soep"),
        dessert: Joi.string().max(191),
        typeSandwiches: Joi.string().max(191).allow(null).optional(),
        hartigBeleg: Joi.string().max(191).allow(null).optional(),
        zoetBeleg: Joi.string().max(191).allow(null).optional(),
        vetstof: Joi.string()
          .valid("vetstof", "geen vetstof")
          .allow(null)
          .optional(),
        //minimaal 1 dag in de toekomst
        leverdatum: Joi.date().iso().min(tomorrow.toISOString()),
        leverplaats: Joi.string().max(191),
        suggestieVanDeMaandId: Joi.number()
          .integer()
          .positive()
          .allow(null)
          .optional(),
        suggestieVanDeMaand: Joi.string().max(191).allow(null).optional(),
      })
    ),
  },
};
const getBestellingByBestellingsnr = async (ctx) => {
  ctx.body = await bestellingService.getByBestellingsnr(
    ctx.params.bestellingsnr
  );
};
getBestellingByBestellingsnr.validationScheme = {
  params: Joi.object({
    bestellingsnr: Joi.number().integer().positive(),
  }),
};

const deleteBestelling = async (ctx) => {
  await bestellingService.deleteByBestellingsnr(
    Number(ctx.params.bestellingsnr)
  );
  ctx.status = 204; //succesvol verwerkt, geen content teruggegeven
};
deleteBestelling.validationScheme = {
  params: Joi.object({
    bestellingsnr: Joi.number().integer().positive(),
  }),
};

const getLeverdataBestellingen = async (ctx) => {
  const { medewerkerId } = ctx.state.session;
  ctx.body = await bestellingService.getLeverdata(medewerkerId);
};
getLeverdataBestellingen.validationScheme = null;

/**
 * Check if the signed in medewerker can access the given bestelling information.
 */
const checkBestellingsnr = async (ctx, next) => {
  const { medewerkerId, rollen } = ctx.state.session;
  const { bestellingsnr } = ctx.params;

  const { medewerkerId: medewerkerIdVanBestellingsnr } =
    await bestellingService.getByBestellingsnr(bestellingsnr);

  // You can only get our own data unless you're an admin
  if (
    medewerkerIdVanBestellingsnr !== medewerkerId &&
    !rollen.includes(Role.ADMIN)
  ) {
    return ctx.throw(
      403,
      "Je bent niet gemachtigd om deze actie uit te voeren",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

/**
 * Install  routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/bestellingen",
  });

  router.get(
    "/",
    validate(getAllBestellingen.validationScheme),
    requireAuthentication,
    getAllBestellingen
  );
  router.post(
    "/",
    validate(createBestelling.validationScheme),
    requireAuthentication,
    createBestelling
  );
  router.get(
    "/leverdata",
    validate(getLeverdataBestellingen.validationScheme),
    requireAuthentication,
    getLeverdataBestellingen
  );
  router.get(
    "/:bestellingsnr",
    validate(getBestellingByBestellingsnr.validationScheme),
    requireAuthentication,
    checkBestellingsnr,
    getBestellingByBestellingsnr
  );
  router.delete(
    "/:bestellingsnr",
    validate(deleteBestelling.validationScheme),
    requireAuthentication,
    checkBestellingsnr,
    deleteBestelling
  );

  app.use(router.routes()).use(router.allowedMethods());
};
