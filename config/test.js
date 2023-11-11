module.exports = {
  log: {
    level: "silly",
    disabled: true,
  },
  cors: {
    origins: ["http://localhost:5173"], //URL van de frontend
    maxAge: 3 * 60 * 60,
  },
  database: { name: "midnightmeals_test" },
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
