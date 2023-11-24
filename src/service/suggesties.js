const suggestieRepository = require("../repository/suggesties");

const handleDBError = require("./_handleDBError");

const getAll = async () => {
  try {
    return await suggestieRepository.findAll();
  } catch (error) {
    throw handleDBError(error);
  }
};

const getByMaandEnVegie = async (maand, vegie) => {
  try {
    return await suggestieRepository.findByMaandEnVegie(maand, vegie);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll, getByMaandEnVegie };
