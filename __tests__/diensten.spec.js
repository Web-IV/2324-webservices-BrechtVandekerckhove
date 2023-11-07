const supertest = require("supertest");
const createServer = require("../src/createServer");

let prisma;

const testDataDiensten = [
  { id: 100, naam: "DIENST 1" },
  { id: 101, naam: "DIENST 2" },
  { id: 102, naam: "TESTDIENST3" },
];
const dienstenToDelete = [100, 101, 102];

describe("Diensten", () => {
  let server;
  let request;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    //hier prisma initialiseren, anders problemen met logger initialisatie
    prisma = require("../src/data/prisma");
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = "/api/diensten";

  describe("GET /api/diensten", () => {
    beforeAll(async () => {
      await prisma.dienst.createMany({
        data: testDataDiensten,
      });
    });

    afterAll(async () => {
      await prisma.dienst.deleteMany({
        where: {
          id: { in: dienstenToDelete },
        },
      });
    });

    it("should 200 and return all diensten", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
      const dienst1 = { id: 100, naam: "DIENST 1" };
      const dienst2 = { id: 101, naam: "DIENST 2" };
      const dienst3 = { id: 102, naam: "TESTDIENST3" };
      expect(response.body.items).toContainEqual(dienst1);
      expect(response.body.items).toContainEqual(dienst2);
      expect(response.body.items).toContainEqual(dienst3);
    });
  });
});
