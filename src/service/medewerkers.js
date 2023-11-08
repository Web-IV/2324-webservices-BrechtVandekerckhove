const medewerkerRepository = require("../repository/medewerkers");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const { hashPassword, verifyPassword } = require("../core/password");

/**
 * Get all medewerkers.
 */
const getAll = async () => {
  const items = await medewerkerRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

/**
 * Get the medewerker with the given id.
 *
 * @param {number} id - Id of the medewerker to get.
 */
const getById = async (id) => {
  try {
    const medewerker = await medewerkerRepository.findById(id);
    return medewerker;
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Register a medewerker.
 *
 * @param {object} medewerker - medewerker to save.
 * @param {string} [medewerker.naam] - Naam of the medewerker.
 *  @param {string} [medewerker.voornaam] - Voornaam of the medewerker
 * @param {string} [medewerker.email] - Email of the medewerker
 */
const register = async ({ naam, voornaam, email, wachtwoord, dienst }) => {
  try {
    const wachtwoord_hash = await hashPassword(wachtwoord);
    const medewerker = await medewerkerRepository.create({
      naam,
      voornaam,
      email,
      dienst,
      wachtwoord_hash,
      rollen: ["user"],
    });
    return await medewerkerRepository.findById(medewerker.id);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing medewerker.
 *
 * @param {number} id - Id of the medewerker to update.
 * @param {object} user - medewerker to save.
 * @param {string} [medewerker.naam] - Naam of the medewerker.
 *  @param {string} [medewerker.voornaam] - Voornaam of the medewerker
 * @param {string} [medewerker.email] - Email of the medewerker
 */

//rollen uitgelaten voor de eenvoud in frontend
const updateById = async (id, { naam, voornaam, email, wachtwoord,dienst }) => {
  const wachtwoord_hash = await hashPassword(wachtwoord);
  try {
    await medewerkerRepository.updateById(id, { naam, voornaam, email, dienst, wachtwoord_hash});
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Delete an existing medewerker.
 *
 * @param {number} id - Id of the medewerker to delete.
 */
const deleteById = async (id) => {
  try {
    const deleted = await medewerkerRepository.deleteById(id);
   
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
};
