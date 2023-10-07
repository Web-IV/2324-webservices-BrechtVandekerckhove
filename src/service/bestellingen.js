let { BESTELLINGEN, MEDERWERKERS } = require("../data/mock_data");

const getAll = () => {
  return { items: BESTELLINGEN, count: BESTELLINGEN.length };
};
const getById = (bestellingsnr) => {
  return BESTELLINGEN.find((b) => b.bestellingsnr === bestellingsnr);
};
//werkt enkel voor 1 maaltijd per bestelling
const create = (bestelling) => {
  const bestellingsnr = BESTELLINGEN.length + 1;
  const besteldatum = new Date();

  const nieuweBestelling = {
    bestellingsnr,
    besteldatum,
    medewerker: {
      id: bestelling.medewerker.id,
      naam: bestelling.medewerker.naam,
      voornaam: bestelling.medewerker.voornaam,
      dienst: bestelling.medewerker.dienst,
    },
    maaltijden: [
      {
        id: bestelling.maaltijden.id,
        leverdatum: bestelling.maaltijden.leverdatum,
        hoofdschotel: bestelling.maaltijden.hoofdschotel,
        soep: bestelling.maaltijden.soep,
        dessert: bestelling.maaltijden.dessert,
      },
    ],
  };

  if (nieuweBestelling.maaltijden.hoofdschotel === "suggestie") {
    nieuweBestelling.maaltijden.suggestieVanDeMaand = {
      id: bestelling.maaltijden.suggestieVanDeMaand.id,
      maand: bestelling.maaltijden.suggestieVanDeMaand.maand,
      vegie: bestelling.maaltijden.suggestieVanDeMaand.vegie,
      omschrijving: bestelling.maaltijden.suggestieVanDeMaand.omschrijving,
    };
  }

  BESTELLINGEN.push(nieuweBestelling);
  return nieuweBestelling;
};

module.exports = {
  getAll,
  getById,
  create,
};
