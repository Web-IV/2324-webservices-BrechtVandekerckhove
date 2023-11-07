const Router = require("@koa/router");
const bestellingService = require("../service/bestellingen");
const Joi = require("joi");
const validate = require("../core/validation");

const getAllBestellingen = async (ctx) => {
  ctx.body = await bestellingService.getAll();
};

const createBestelling = async (ctx) => {
  const nieuweBestelling = await bestellingService.create(ctx.request.body);
  ctx.body = nieuweBestelling;
  ctx.status = 201; //created
};

//voor validationScheme
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

createBestelling.validationScheme = {
  body: {
    medewerkerId: Joi.number().integer().positive(),
    maaltijden: Joi.array().items(
      Joi.object({
        type: Joi.string().valid("warmeMaaltijd", "broodMaaltijd"),
        hoofdschotel: Joi.string().max(191).allow(null).optional(),
        soep: Joi.string().valid("dagsoep", "geen soep"),
        dessert: Joi.string().max(191),
        typeSandwiches: Joi.string().max(191).allow(null).optional(),
        hartigBeleg: Joi.string().max(191).allow(null).optional(),
        zoetBeleg: Joi.string().max(191).allow(null).optional(),
        vetstof: Joi.string().valid("vetstof", "geen vetstof").allow(null).optional(),
        //minimaal 1 dag in de toekomst
        leverdatum: Joi.date().iso().min(tomorrow.toISOString()),
        leverplaats: Joi.string().max(191),
        suggestieVanDeMaandId: Joi.number().integer().positive().allow(null).optional(),
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

const getLeverdataBestellingen = async (ctx) => {
  ctx.body = await bestellingService.getLeverdata();
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

  router.get("/", getAllBestellingen);
  router.post("/",validate( createBestelling.validationScheme), createBestelling);
  router.get("/leverdata", getLeverdataBestellingen);
  router.get(
    "/:bestellingsnr",
    validate(getBestellingByBestellingsnr.validationScheme),
    getBestellingByBestellingsnr
  );
  router.delete("/:bestellingsnr", deleteBestelling);

  app.use(router.routes()).use(router.allowedMethods());
};
