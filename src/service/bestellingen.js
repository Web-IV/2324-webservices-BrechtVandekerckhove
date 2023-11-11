const bestellingenRepository = require("../repository/bestellingen");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

//medewerkersId optioneel, indien niet meegegeven worden alle bestellingen opgehaald
const getAll = async (medewerkerId) => {
  return await bestellingenRepository.findAll(medewerkerId);
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
    const deleted = await bestellingenRepository.deleteByBestellingsnr(
      bestellingsnr
    );
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
//medewerkersId optioneel, indien niet meegegeven worden de leverdata van alle bestellingen opgehaald
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
