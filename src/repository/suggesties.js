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
  if (suggestie === null) {
    const error = new Error();
    error.code = 404;
    error.code = "NOT_FOUND";
    error.message = `GGeen suggestie gevonden voor maand ${maand} en vegie ${vegie}`;
    error.details = { bestellingsnr };
    throw error;
  }
  return { omschrijving: suggestie.omschrijving };
};
module.exports = { findAll, findByMaandEnVegie };
