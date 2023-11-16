module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["https://web-iv-2324-frontendweb.onrender.com"], //URL van de frontend
    maxAge: 3 * 60 * 60,
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret:
        "eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked",
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: "brecht.vandekerckhove@student.hogent.be",
      audience: "brecht.vandekerckhove@student.hogent.be",
    },
  },
  port: 9000,
};
