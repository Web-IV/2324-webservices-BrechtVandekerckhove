const suggestieRepository = require("../repository/suggesties");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  return await suggestieRepository.findAll();
};

const getByMaandEnVegie = async (maand, vegie) => {
  try {
    return await suggestieRepository.findByMaandEnVegie(maand, vegie);
  } catch (error) {
    throw new handleDBError(error);
  }
};

module.exports = { getAll, getByMaandEnVegie };
