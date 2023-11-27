const config = require("config");

const { initializeLogger } = require("../src/core/logging");
const Role = require("../src/core/rollen");
let prisma;

module.exports = async () => {
  // Create a database connection
  initializeLogger(config.get("log.level"), config.get("log.disabled"));
  prisma = require("../src/data/prisma");

  // Clear all data from the database to ensure a clean state
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

  const testDataDiensten = [
    { id: 100, naam: "DIENST 1" },
    { id: 101, naam: "DIENST 2" },
  ];
  const testDiensten = await prisma.dienst.createMany({
    data: testDataDiensten,
  });

  const testMedewerker1 = await prisma.medewerker.create({
    data: {
      naam: "Test",
      voornaam: "User",
      email: "test.user@hogent.be",
      wachtwoord_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
      rollen: JSON.stringify([Role.USER]),
      dienst: {
        connect: {
          naam: "DIENST 1",
        },
      },
    },
  });
  const testMedewerker2 = await prisma.medewerker.create({
    data: {
      naam: "Admin",
      voornaam: "User",
      email: "admin.user@hogent.be",
      wachtwoord_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
      rollen: JSON.stringify([Role.ADMIN, Role.USER]),
      dienst: {
        connect: {
          naam: "DIENST 2",
        },
      },
    },
  });
};
