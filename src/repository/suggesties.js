const prisma = require("../data/prisma");

const findAll = async () => {
  const suggesties = await prisma.suggestieVanDeMaand.findMany();
  return { items: suggesties, count: suggesties.length };
};

//niet in gebruik, werkt wel
const findByMaandEnVegie = async (maand, vegie) => {
  //findFirst: combi maand en vegie wordt uniek afgedwongen in database
  const suggestie = await prisma.suggestieVanDeMaand.findFirst({
    where: { maand, vegie },
  });
  return {  omschrijving: suggestie.omschrijving  };
};
module.exports = { findAll, findByMaandEnVegie };
