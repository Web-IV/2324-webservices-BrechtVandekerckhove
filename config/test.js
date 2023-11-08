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
  },
};
