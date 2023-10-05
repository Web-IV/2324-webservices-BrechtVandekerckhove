let { BESTELLINGEN, MEDERWERKERS } = require("../data/mock_data");

const getAll = () => {
  return { items: BESTELLINGEN, count: BESTELLINGEN.length };
};

module.exports = {
  getAll,
};
