const prisma = require("../data/prisma");

const findAll = async () => {
  const diensten = await prisma.dienst.findMany();
  return { items: diensten, count: diensten.length };
};

module.exports = { findAll };
