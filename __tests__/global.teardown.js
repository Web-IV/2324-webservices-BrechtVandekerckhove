const prisma = require("../src/data/prisma");

module.exports = async () => {
  // Remove any leftover data

  await prisma.medewerker.deleteMany();
  await prisma.dienst.deleteMany();
  await prisma.maaltijd.deleteMany();+
  await prisma.suggestieVanDeMaand.deleteMany();
  await prisma.bestelling.deleteMany();



  // Close database connection
  await prisma.$disconnect();
};
