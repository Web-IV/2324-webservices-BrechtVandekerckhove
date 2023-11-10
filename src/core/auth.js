const medewerkerService = require("../service/medewerkers");
//authenticatie
const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await medewerkerService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session;
  ctx.state.authToken = authToken;
  return next();
};
//autorisatie
const makeRequireRole = (rol) => async (ctx, next) => {
  const { rollen = [] } = ctx.state.session;
  medewerkerService.checkRole(rol, rollen);
  return next();
};

module.exports = {
  requireAuthentication,
  makeRequireRole,
};
