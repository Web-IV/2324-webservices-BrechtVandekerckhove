const { getLogger } = require("../core/logging");
const bestellingenRepository = require("../repository/bestellingen");

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
    getLogger().error(
      `er is geen bestelling met bestellingsnr ${bestellingsnr}.`,
      error
    );
  }
};
const deleteByBestellingsnr = async (bestellingsnr) => {
  try {
    const deleted = await bestellingenRepository.deleteByBestellingsnr(
      bestellingsnr
    );
  } catch (error) {
    getLogger().error(
      `Er is geen bestelling met bestellingsnr ${bestellingsnr}`
    );
  }
};

const create = async (bestelling) => {

  const nieuweBestelling = await bestellingenRepository.create(bestelling);
  return nieuweBestelling;
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
