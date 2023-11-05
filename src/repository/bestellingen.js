const prisma = require("../data/prisma");

const findAll = async () => {
  const bestellingen = await prisma.bestelling.findMany({
    include: {
      medewerker: { include: { dienst: true } },
      maaltijden: { include: { suggestieVanDeMaand: true, leverplaats: true } },
    },
  });
  const transformedBestellingen = bestellingen.map((bestelling) => {
    const transformedMaaltijden = bestelling.maaltijden.map((maaltijd) => {
      return transformedMaaltijd(maaltijd);
    });
    return {
      ...bestelling,
      maaltijden: transformedMaaltijden,
    };
  });

  return { items: transformedBestellingen, count: bestellingen.length };
};

const findByBestellingsnr = async (bestellingsnr) => {
  const bestelling = await prisma.bestelling.findUnique({
    where: { bestellingsnr: bestellingsnr },
    include: {
      medewerker: { include: { dienst: true } },
      maaltijden: { include: { suggestieVanDeMaand: true, leverplaats: true } },
    },
  });

  const transformedMaaltijden = bestelling.maaltijden.map((maaltijd) => {
    return transformedMaaltijd(maaltijd);
  });
  return {
    ...bestelling,

    maaltijden: transformedMaaltijden,
  };
};

//booleans omvormen naar strings
const transformedMaaltijd = (maaltijd) => {
  const transformedMaaltijd = {
    ...maaltijd,
    soep:
      maaltijd.soep === null ? null : maaltijd.soep ? "dagsoep" : "geen soep",
    vetstof:
      maaltijd.vetstof === null
        ? null
        : maaltijd.vetstof
        ? "vetstof"
        : "geen vetstof",
  };
  return transformedMaaltijd;
};

const deleteByBestellingsnr = async (bestellingsnr) => {
  //bijhorende maaltijden worden ook vewijderd door cascade in schema.prisma
  const deleted = await prisma.bestelling.delete({
    where: { bestellingsnr: bestellingsnr },
  });
  return deleted;
};

const create = async (bestelling) => {
  const transformedMaaltijden = await Promise.all(
    bestelling.maaltijden.map(async (maaltijd) => {
      //suggestieVanDeMaanOmschrijving niet opnemen in maaltijd tabel, enkel suggestieVanDeMaandId
      //leverplaats omzetten naar leverplaatsId
      const { suggestieVanDeMaandOmschrijving, leverplaats, ...rest } =
        maaltijd;
      const { id: leverplaatsId } = await prisma.dienst.findUnique({
        where: { naam: leverplaats },
      });

      return {
        ...rest,
        leverplaatsId: leverplaatsId,
        soep:
          maaltijd.soep === undefined
            ? null
            : maaltijd.soep === "dagsoep"
            ? true
            : false,
        vetstof:
          maaltijd.vetstof === undefined
            ? null
            : maaltijd.vetstof === "vetstof"
            ? true
            : false,
      };
    })
  );

  const createdBestelling = await prisma.bestelling.create({
    data: {
      besteldatum: new Date(), // besteldatum hier laten genereren
      medewerkerId: bestelling.medewerkerId,
      maaltijden: {
        create: transformedMaaltijden, // maaltijden creeeren (id wordt hier automatisch gegenereerd )
      },
    },
    include: {
      maaltijden: true, // Hiermee worden de toegevoegde maaltijden opgenomen in het resultaat
    },
  });
  return createdBestelling;
};

module.exports = {
  findAll,
  findByBestellingsnr,
  deleteByBestellingsnr,
  create,
};
