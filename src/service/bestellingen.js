const { getLogger } = require("../core/logging");
let { BESTELLINGEN, MEDERWERKERS } = require("../data/mock_data");
const bestellingenRepository = require("../repository/bestellingen");

const getAll = async () => {
  return await bestellingenRepository.findAll();
};

const getByBestellingsnr = (bestellingsnr) => {
  const bestelling = BESTELLINGEN.find(
    (b) => b.bestellingsnr === bestellingsnr
  );
  if (!bestelling) {
    getLogger().error(
      `Er is geen bestelling met bestellingsnr ${bestellingsnr}`
    );
  }
  return bestelling;
};
const deleteByBestellingsnr = (bestellingsnr) => {
  const index = BESTELLINGEN.findIndex(
    (b) => b.bestellingsnr === bestellingsnr
  );
  if (index >= 0) {
    BESTELLINGEN.splice(index, 1);
  } else {
    getLogger().error(
      `Er is geen bestelling met bestellingsnr ${bestellingsnr}`
    );
  }
};

const create = (bestelling) => {
  const nieuweBestelling = {
    //bestellingsnr in databank laten genereren??
    bestellingsnr: BESTELLINGEN.length + 1,
    besteldatum: new Date(),
    medewerker: { ...bestelling.medewerker },
    maaltijden: [],
  };
  bestelling.maaltijden.forEach((maaltijd) => {
    const nieuweMaaltijd = { ...maaltijd };
    //strings omvormen naar booleans:
    nieuweMaaltijd.soep = maaltijd.soep === "soep";
    if (nieuweMaaltijd.vetstof) {
      nieuweMaaltijd.vetstof = maaltijd.vetstof === "vetstof";
    }
    nieuweBestelling.maaltijden.push(nieuweMaaltijd);
  });

  BESTELLINGEN.push(nieuweBestelling);
  return nieuweBestelling;
};

const getLeverdata = () => {
  return BESTELLINGEN.reduce((acc, bestelling) => {
    bestelling.maaltijden.forEach((maaltijd) => {
      acc.push(maaltijd.leverdatum);
    });
    return acc;
  }, []);
};

module.exports = {
  getAll,
  getByBestellingsnr,
  deleteByBestellingsnr,
  create,
  getLeverdata,
};
