const dienstenRepository = require("../repository/diensten.js");

const handleDBError = require("./_handleDBError");

const getAll = async () => {
  try {
    return await dienstenRepository.findAll();
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll };
