const suggestieRepository = require("../repository/suggesties");

const getAll = async () => {
  return await suggestieRepository.findAll();
};

const getByMaandEnVegie = async (maand, vegie) => {
  return await suggestieRepository.findByMaandEnVegie(maand, vegie);
}

module.exports = { getAll, getByMaandEnVegie };
