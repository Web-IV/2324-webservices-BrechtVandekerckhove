const dienstenRepository = require("../repository/diensten.js");

const getAll = async () => {
  return await dienstenRepository.findAll();
};

module.exports = { getAll };
