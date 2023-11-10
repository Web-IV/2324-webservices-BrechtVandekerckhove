const prisma = require("../data/prisma");
const { getLogger } = require("../core/logging");

//medewerksId optioneel, indien niet meegegeven worden alle bestellingen opgehaald
const findAll = async (medewerkerId) => {
  let bestellingen;
  if (medewerkerId) {
    bestellingen = await prisma.bestelling.findMany({
      where: { medewerkerId: medewerkerId },
      include: {
        medewerker: { include: { dienst: true } },
        maaltijden: {
          include: { suggestieVanDeMaand: true, leverplaats: true },
        },
      },
    });
  } else {
    bestellingen = await prisma.bestelling.findMany({
      include: {
        medewerker: { include: { dienst: true } },
        maaltijden: {
          include: { suggestieVanDeMaand: true, leverplaats: true },
        },
      },
    });
  }
  const transformedBestellingen = bestellingen.map((bestelling) => {
    const transformedMaaltijden = bestelling.maaltijden.map((maaltijd) => {
      return transformedMaaltijd(maaltijd);
    });
    const tranformedMedewerker = makeExposedMedewerker(bestelling.medewerker);
    return {
      ...bestelling,
      medewerker: tranformedMedewerker,
      maaltijden: transformedMaaltijden,
    };
  });

  return { items: transformedBestellingen, count: bestellingen.length };
};

const findByBestellingsnr = async (bestellingsnr) => {
  try {
    const bestelling = await prisma.bestelling.findUnique({
      where: { bestellingsnr: bestellingsnr },
      include: {
        medewerker: { include: { dienst: true } },
        maaltijden: {
          include: { suggestieVanDeMaand: true, leverplaats: true },
        },
      },
    });
    if (!bestelling) {
      const error = new Error();
      error.code = "NOT_FOUND";
      error.message = `Geen bestelling gevonden met bestellingsnr ${bestellingsnr}`;
      error.details = { bestellingsnr };
      throw error;
    }
    const transformedMaaltijden = bestelling.maaltijden.map((maaltijd) => {
      return transformedMaaltijd(maaltijd);
    });
    const tranformedMedewerker = makeExposedMedewerker(bestelling.medewerker);

    return {
      ...bestelling,
      medewerker: tranformedMedewerker,
      maaltijden: transformedMaaltijden,
    };
  } catch (error) {
    getLogger().error(`Error in findByBestellingsnr.`, error);
    throw error;
  }
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

const makeExposedMedewerker = (medewerker) => {
  const { wachtwoord_hash, ...rest } = medewerker;
  return rest;
};

const deleteByBestellingsnr = async (bestellingsnr) => {
  //bijhorende maaltijden worden ook vewijderd door cascade in schema.prisma
  try {
    const deleted = await prisma.bestelling.delete({
      where: { bestellingsnr: bestellingsnr },
    });

    return deleted;
  } catch (error) {
    getLogger().error(`Error in deleteByBestellingsnr.`, error);
    throw error;
  }
};

//error logging nog toevoegen
const create = async (bestelling) => {
  try {
    const transformedMaaltijden = await Promise.all(
      bestelling.maaltijden.map(async (maaltijd) => {
        //eerst controle of er al een maaltijd bestaat op dezelfde leverdatum voor dezelfde medewerker
        const maaltijdMetZelfdeLeverdatum = await prisma.maaltijd.findFirst({
          where: {
            bestelling: {
              medewerkerId: bestelling.medewerkerId,
            },
            leverdatum: maaltijd.leverdatum,
          },
        });
        if (maaltijdMetZelfdeLeverdatum) {
          throw new Error(
            `Reeds maaltijd gekend op leverdatum ${maaltijd.leverdatum} voor medewerker met id ${bestelling.medewerkerId}.`
          );
        } else {
          //suggestieVanDeMaand niet opnemen in maaltijd tabel, enkel suggestieVanDeMaandId
          //leverplaats omzetten naar leverplaatsId
          const { suggestieVanDeMaand, leverplaats, ...rest } = maaltijd;
          const leverplaatsRecord = await prisma.dienst.findUnique({
            where: { naam: leverplaats },
          });
          if (leverplaatsRecord === null) {
            const error = new Error();
            error.code = "NOT_FOUND";
            error.message = `Leverplaats ${leverplaats} is niet gekend.`;
            error.details = { leverplaats };
            throw error;
          }
          const { id: leverplaatsId } = leverplaatsRecord;
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
        }
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
        medewerker: { include: { dienst: true } },
        maaltijden: {
          include: { suggestieVanDeMaand: true, leverplaats: true },
        }, // Hiermee worden de toegevoegde maaltijden,suggestie, medewerker en leverplaats opgenomen in het resultaat
      },
    });
    const { medewerker, ...restBestelling } = createdBestelling;
    const tranformedMedewerker = makeExposedMedewerker(medewerker);
    return { medewerker: tranformedMedewerker, ...restBestelling };
  } catch (error) {
    getLogger().error(`Error in create.`, error);
    throw error;
  }
};

module.exports = {
  findAll,
  findByBestellingsnr,
  deleteByBestellingsnr,
  create,
};
