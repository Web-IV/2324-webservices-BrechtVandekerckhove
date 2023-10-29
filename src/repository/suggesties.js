const prisma = require("../data/prisma");

const findAll = async () => {
  const suggesties = await prisma.suggestieVanDeMaand.findMany();
  return { items: suggesties, count: suggesties.length };
};
const findByMaandEnVegie = async (maand, vegie) => {
  //findFirst: combi maand en vegie wordt uniek afgedwongen in database
  const suggestie = await prisma.suggestieVanDeMaand.findFirst({
    where: { maand, vegie },
  });
  return { items: suggestie };
};
module.exports = { findAll, findByMaandEnVegie };
