const prisma = require("../src/data/prisma");

module.exports = async () => {
  // Remove any leftover data
  const deleteDiensten = prisma.dienst.deleteMany();
  const deleteSuggesties = prisma.suggestieVanDeMaand.deleteMany();
  const deleteMedewerkers = prisma.medewerker.deleteMany();
  const deleteBestellingen = prisma.bestelling.deleteMany();
  const deleteMaaltijden = prisma.maaltijd.deleteMany();

  await prisma.$transaction([
    deleteSuggesties,
    deleteBestellingen,
    deleteMedewerkers,
    deleteMaaltijden,
    deleteDiensten,
  ]);


  // Close database connection
  await prisma.$disconnect();
};
