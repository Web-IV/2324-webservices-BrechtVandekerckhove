const medewerkerRepository = require("../repository/medewerkers");
const ServiceError = require("../core/serviceError");
const { hashPassword, verifyPassword } = require("../core/password");
const Role = require("../core/rollen");
const { generateJWT, verifyJWT } = require("../core/jwt");
const { getLogger } = require("../core/logging");

const handleDBError = require("./_handleDBError");

/**
 * Get all medewerkers.
 */
const getAll = async () => {
  const items = await medewerkerRepository.findAll();
  return {
    items: Object.values(items).map((medewerker) =>
      makeExposedMedewerker(medewerker)
    ),
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
    return makeExposedMedewerker(medewerker);
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
    const medewerkerId = await medewerkerRepository.create({
      naam,
      voornaam,
      email,
      dienst,
      wachtwoord_hash,
      rollen: [Role.USER],
    });

    const medewerker = await medewerkerRepository.findById(medewerkerId);
    return await makeLoginData(medewerker);
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
const updateById = async (
  id,
  { naam, voornaam, email, dienst, huidigWachtwoord, nieuwWachtwoord }
) => {
  const medewerker = await medewerkerRepository.findById(id);
  const passwordValid = await verifyPassword(
    huidigWachtwoord,
    medewerker.wachtwoord_hash
  );

  if (!passwordValid) {
    // gebruiker is hier ingelogd bij wijziging van gegevens
    throw ServiceError.unauthorized("Foutief wachtwoord!");
  }
  if (nieuwWachtwoord) {
    huidigWachtwoord = nieuwWachtwoord;
  }
  const wachtwoord_hash = await hashPassword(huidigWachtwoord);
  try {
    await medewerkerRepository.updateById(id, {
      naam,
      voornaam,
      email,
      dienst,
      wachtwoord_hash,
    });
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
    await medewerkerRepository.deleteById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const makeExposedMedewerker = (medewerker) => {
  const { wachtwoord_hash, ...rest } = medewerker;
  return rest;
};

const makeLoginData = async (medewerker) => {
  const token = await generateJWT(medewerker);
  return {
    medewerker: makeExposedMedewerker(medewerker),
    token,
  };
};

const login = async (email, wachtwoord) => {
  const medewerker = await medewerkerRepository.findByEmail(email);

  if (!medewerker) {
    throw ServiceError.unauthorized(
      "Het opgegeven e-mailadres en wachtwoord komen niet overeen."
    );
  }

  const passwordValid = await verifyPassword(
    wachtwoord,
    medewerker.wachtwoord_hash
  );

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      "Het opgegeven e-mailadres en wachtwoord komen niet overeen."
    );
  }

  return await makeLoginData(medewerker);
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("Je moet ingelogd zijn.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  // Remove Bearer from string
  const authToken = authHeader.substring(7);
  try {
    const { rollen, medewerkerId } = await verifyJWT(authToken);

    return {
      medewerkerId,
      rollen,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};
const checkRole = (rol, rollen) => {
  const hasPermission = rollen.includes(rol);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      "Je bent niet gemachtigd om deze actie uit te voeren."
    );
  }
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
  login,
  checkAndParseSession,
  checkRole,
  makeExposedMedewerker,
};
