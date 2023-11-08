const bestellingenRepository = require("../repository/bestellingen");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  return await bestellingenRepository.findAll();
};

const getByBestellingsnr = async (bestellingsnr) => {
  try {
    const bestelling = await bestellingenRepository.findByBestellingsnr(
      bestellingsnr
    );
    return bestelling;
  } catch (error) {
    throw ServiceError.notFound(
      `Geen bestelling gevonden met bestellingsnr ${bestellingsnr}`,
      { bestellingsnr }
    );
  }
};
const deleteByBestellingsnr = async (bestellingsnr) => {
  try {
    const deleted = await bestellingenRepository.deleteByBestellingsnr(
      bestellingsnr
    );
  } catch (error) {
    throw ServiceError.notFound(error.message, { bestellingsnr });
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

const getLeverdata = async () => {
  const bestellingen = await getAll();
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
