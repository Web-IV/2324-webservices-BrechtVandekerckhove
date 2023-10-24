const Router = require("@koa/router");
const bestellingService = require("../service/bestellingen");

const getAllBestellingen = async (ctx) => {
  ctx.body = bestellingService.getAll();
};

const nieuweBestelling = async (ctx) => {
  const nieuweBestelling = bestellingService.create(ctx.request.body);
  ctx.body = nieuweBestelling;
};

const getBestellingByBestellingsnr = async (ctx) => {
  ctx.body = bestellingService.getByBestellingsnr(
    Number(ctx.params.bestellingsnr)
  );
};

const deleteBestelling = async (ctx) => {
  bestellingService.deleteByBestellingsnr(Number(ctx.params.bestellingsnr));
  ctx.status = 204; //succesvol verwerkt, geen content teruggegeven
};

const getLeverdataBestellingen = async (ctx) => {
  ctx.body = bestellingService.getLeverdata();
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/bestellingen",
  });

  router.get("/", getAllBestellingen);
  router.post("/", nieuweBestelling);
  router.get("/leverdata", getLeverdataBestellingen);
  router.get("/:bestellingsnr", getBestellingByBestellingsnr);
  router.delete("/:bestellingsnr", deleteBestelling);

  app.use(router.routes()).use(router.allowedMethods());
};
