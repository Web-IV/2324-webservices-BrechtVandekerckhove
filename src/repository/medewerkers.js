const prisma = require("../data/prisma");
const { getLogger } = require("../core/logging");

const findAll = async () => {
  const medewerkers = await prisma.medewerker.findMany();
  return medewerkers;
};

const findById = async (id) => {
  const medewerker = await prisma.medewerker.findUnique({
    where: { id: id },
  });
  if (!medewerker) {
    const error = new Error();
    error.code = "NOT_FOUND";
    error.message = `Geen medewerker gevonden met id ${id}`;
    error.details = { id };
    throw error;
  }
  return medewerker;
};

const create = async ({
  naam,
  voornaam,
  email,
  dienst,
  wachtwoord_hash,
  rollen,
}) => {
  try {
    const dienstId = await dienstOmzettenNaarId(dienst);
    const medewerkerId = await prisma.medewerker.create({
      data: {
        naam: naam,
        voornaam: voornaam,
        email: email,
        dienstId: dienstId,
        wachtwoord_hash: wachtwoord_hash,
        rollen: JSON.stringify(rollen),
      },
    });
    return medewerkerId;
  } catch (error) {
    getLogger().error(`Error in create medewerker.`, { error });
    throw error;
  }
};
//rollen uitgelaten voor de eenvoud in frontend
const updateById = async (id, { naam, voornaam, email,wachtwoord_hash,dienst}) => {
  try {
    const dienstId = await dienstOmzettenNaarId(dienst);
    const updateMedewerker = await prisma.medewerker.update({
      where: { id: id },
      data: {
        naam: naam,
        voornaam: voornaam,
        email: email,
        wachtwoord_hash: wachtwoord_hash,
        dienstId: dienstId,
      },
    });
  } catch (error) {
    getLogger().error(`Error in update medewerker.`, { error });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const deleteMedewerker = await prisma.medewerker.delete({
      where: { id: id },
    });

  } catch (error) {
    getLogger().error(`Error in delete medewerker.`, { error });
    throw error;
  }
};

const dienstOmzettenNaarId = async (dienst) => {
  const dienstRecord = await prisma.dienst.findUnique({
    where: { naam: dienst },
  });
  if (dienstRecord === null) {
    const error = new Error();
    error.code = "NOT_FOUND";
    error.message = `Dienst ${dienst} is niet gekend.`;
    error.details = { dienst };
    throw error;
  }
  return dienstRecord.id;
};

module.exports = { findAll, findById, create, updateById , deleteById};
