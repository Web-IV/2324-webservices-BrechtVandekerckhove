const prisma = require("../data/prisma");

const findAll = async () => {
  const bestellingen = await prisma.bestelling.findMany({
    include: {
      medewerker: true,
      maaltijden: true,
    },
  });
 //booleans omvormen naar ja/nee strings:
  const transformedBestellingen = bestellingen.map((bestelling) => {
    const transformedMaaltijden = bestelling.maaltijden.map((maaltijd) => {
      return {
        ...maaltijd,
        soep: maaltijd.soep === null ? null : maaltijd.soep ? "ja" : "nee",
        vetstof: maaltijd.vetstof === null ? null : maaltijd.vetstof ? "ja" : "nee",
      };
    });

    return { ...bestelling, maaltijden: transformedMaaltijden };
  });

  return { bestellingen:transformedBestellingen, count: bestellingen.length };
};

module.exports = {
  findAll,
};
