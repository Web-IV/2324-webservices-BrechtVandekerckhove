const bestellingenRepository = require("../repository/bestellingen");
const Role = require("../core/rollen");
const prisma = require("../data/prisma");

const handleDBError = require("./_handleDBError");

//ADMIN mag alles zien, USER mag enkel eigen bestellingen zien
const getAll = async (medewerkerId, rollen) => {
  try {
    if (rollen && rollen.includes(Role.ADMIN)) {
      return await bestellingenRepository.findAll();
    } else {
      return await bestellingenRepository.findAll(medewerkerId);
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const getByBestellingsnr = async (bestellingsnr) => {
  try {
    const bestelling = await bestellingenRepository.findByBestellingsnr(
      bestellingsnr
    );
    return bestelling;
  } catch (error) {
    throw handleDBError(error);
  }
};
const deleteByBestellingsnr = async (bestellingsnr) => {
  try {
    //controle of alle maaltijden in de toekomst liggen
    const bestelling = await bestellingenRepository.findByBestellingsnr(
      bestellingsnr
    );
    bestelling.maaltijden.forEach((maaltijd) => {
      if (maaltijd.leverdatum < new Date()) {
        const error = new Error();
        error.status = 403;
        error.code = "FORBIDDEN";
        error.message = `Kan bestelling met bestellingsnr ${bestellingsnr} niet verwijderen, omdat er minstens 1 maaltijd in het verleden ligt.`;
        error.details = { bestellingsnr };
        throw error;
      }
    });

    await bestellingenRepository.deleteByBestellingsnr(bestellingsnr);
  } catch (error) {
    throw handleDBError(error);
  }
};

const create = async (bestelling) => {
  try {
    //eerst controle of er al een maaltijd bestaat op dezelfde leverdatum voor dezelfde medewerker
    bestelling.maaltijden.map(async (maaltijd) => {
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
      }
    });

    const nieuweBestelling = await bestellingenRepository.create(bestelling);
    return nieuweBestelling;
  } catch (error) {
    throw handleDBError(error);
  }
};

const getLeverdata = async (medewerkerId) => {
  try {
    const bestellingen = await getAll(medewerkerId);
    const leverdata = bestellingen.items.reduce((acc, bestelling) => {
      bestelling.maaltijden.forEach((maaltijd) => {
        acc.push(maaltijd.leverdatum);
      });
      return acc;
    }, []);
    return { items: leverdata };
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getByBestellingsnr,
  deleteByBestellingsnr,
  create,
  getLeverdata,
};
