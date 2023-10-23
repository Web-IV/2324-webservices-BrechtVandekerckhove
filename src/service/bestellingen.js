let { BESTELLINGEN, MEDERWERKERS } = require("../data/mock_data");

const getAll = () => {
  return { items: BESTELLINGEN, count: BESTELLINGEN.length };
};
const getById = (bestellingsnr) => {
  return BESTELLINGEN.find((b) => b.bestellingsnr === bestellingsnr);
};
const deleteById = (bestellingsnr) => {
  const index = BESTELLINGEN.findIndex(
    (b) => b.bestellingsnr === bestellingsnr
  );
  if (index >= 0) {
    BESTELLINGEN.splice(index, 1);
  } else {
    getLogger().error(
      "Er is geen bestelling met bestellingsnr ${bestellingsnr}"
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
    /*const nieuweMaaltijd = {
      id: maaltijd.id,
      type: maaltijd.type,
      leverdatum: maaltijd.leverdatum,
      soep: maaltijd.soep === "soep",
      dessert: maaltijd.dessert,
    };
    if (maaltijd.type === "broodMaaltijd") {
      nieuweMaaltijd.typeSandwiches = maaltijd.typeSandwiches;
      nieuweMaaltijd.hartigBeleg = maaltijd.hartigBeleg;
      nieuweMaaltijd.zoetBeleg = maaltijd.zoetBeleg;
      nieuweMaaltijd.vetstof = maaltijd.vetstof === "vetstof";
    }
    if (maaltijd.type === "warmeMaaltijd") {
      nieuweMaaltijd.hoofdschotel = maaltijd.hoofdschotel;
      if (nieuweBestelling.maaltijden.hoofdschotel === "suggestie") {
        nieuweBestelling.maaltijden.suggestieVanDeMaand = {
          id: bestelling.maaltijden.suggestieVanDeMaand.id,
          maand: bestelling.maaltijden.suggestieVanDeMaand.maand,
          vegie: bestelling.maaltijden.suggestieVanDeMaand.vegie,
          omschrijving: bestelling.maaltijden.suggestieVanDeMaand.omschrijving,
        };
      }
    }*/
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

module.exports = {
  getAll,
  getById,
  deleteById,
  create,
};
