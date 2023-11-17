const bestellingenRepository = require("../repository/bestellingen");
const Role = require("../core/rollen");

const handleDBError = require("./_handleDBError");

//ADMIN mag alles zien, USER mag enkel eigen bestellingen zien
const getAll = async (medewerkerId, rollen) => {
  if (rollen && rollen.includes(Role.ADMIN)) {
    return await bestellingenRepository.findAll();
  } else {
    return await bestellingenRepository.findAll(medewerkerId);
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
    await bestellingenRepository.deleteByBestellingsnr(bestellingsnr);
  } catch (error) {
    throw handleDBError(error);
  }
};

const create = async (bestelling) => {
  try {
    const nieuweBestelling = await bestellingenRepository.create(bestelling);
    return nieuweBestelling;
  } catch (error) {
    throw handleDBError(error);
  }
};

const getLeverdata = async (medewerkerId) => {
  const bestellingen = await getAll(medewerkerId);
  const leverdata = bestellingen.items.reduce((acc, bestelling) => {
    bestelling.maaltijden.forEach((maaltijd) => {
      acc.push(maaltijd.leverdatum);
    });
    return acc;
  }, []);
  return { items: leverdata };
};

module.exports = {
  getAll,
  getByBestellingsnr,
  deleteByBestellingsnr,
  create,
  getLeverdata,
};
