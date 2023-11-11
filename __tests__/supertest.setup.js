const supertest = require("supertest");

const createServer = require("../src/createServer");

const login = async (supertest) => {
  const response = await supertest.post("/api/medewerkers/login").send({
    email: "test.user@hogent.be",
    wachtwoord: "12345678",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }
  return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
  const response = await supertest.post("/api/medewerkers/login").send({
    email: "admin.user@hogent.be",
    wachtwoord: "12345678",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "Unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
  let server;
  beforeAll(async () => {
    server = await createServer();

    setter({
      prisma: require("../src/data/prisma"),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

module.exports = {
  login,
  withServer,
  loginAdmin,
};
