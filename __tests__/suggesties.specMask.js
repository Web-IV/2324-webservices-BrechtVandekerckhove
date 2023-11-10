const supertest = require("supertest");
const createServer = require("../src/createServer");

let prisma;

const testDataSuggestieVanDeMaand = [
  {
    id: 99,
    maand: 11,
    vegie: true,
    omschrijving: "test suggestie omschrijving november",
  },

  {
    id: 100,
    maand: 12,
    vegie: false,
    omschrijving: "test suggestie omschrijving december",
  },
  {
    id: 101,
    maand: 12,
    vegie: true,
    omschrijving: "test vegie suggestie omschrijving december",
  },
];
const suggestiesToDelete = [99, 100, 101];

describe("Suggesties", () => {
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

  const url = "/api/suggesties";

  describe("GET /api/suggesties", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });
    });

    afterAll(async () => {
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: suggestiesToDelete },
        },
      });
    });

    it("should 200 and return all suggesties", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
      const suggestie1 = {
        id: 99,
        maand: 11,
        vegie: true,
        omschrijving: "test suggestie omschrijving november",
      };
      const suggestie2 = {
        id: 100,
        maand: 12,
        vegie: false,
        omschrijving: "test suggestie omschrijving december",
      };
      const suggestie3 = {
        id: 101,
        maand: 12,
        vegie: true,
        omschrijving: "test vegie suggestie omschrijving december",
      };
      expect(response.body.items).toContainEqual(suggestie1);
      expect(response.body.items).toContainEqual(suggestie2);
      expect(response.body.items).toContainEqual(suggestie3);
    });
  });
  describe("GET /api/suggesties?maand=${maand}&vegie={vegie}", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });
    });

    afterAll(async () => {
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: suggestiesToDelete },
        },
      });
    });

    it("should 200 and return correcte suggestie omschrijving", async () => {
      const response = await request.get(`${url}?maand=12&vegie=true`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        omschrijving: "test vegie suggestie omschrijving december",
      });
    });
  });
});
