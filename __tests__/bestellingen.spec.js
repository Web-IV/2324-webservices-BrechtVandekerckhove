const supertest = require("supertest");
const createServer = require("../src/createServer");
const jestDate = require("jest-date-mock");
let prisma;

const testDataDiensten = [
  { id: 100, naam: "DIENST 1" },
  { id: 101, naam: "DIENST 2" },
];

const testDataSuggestieVanDeMaand = [
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

//id medewerker wordt genereerd door prisma,
//id maaltijden worden genereerd door prisma
const testdataMedewerkerBestellingen = {
  naam: "Test",
  voornaam: "User",
  dienst: {
    connect: {
      naam: "DIENST 1",
    },
  },
  bestellingen: {
    create: [
      {
        bestellingsnr: 100,
        besteldatum: new Date("2023-12-05"),
        maaltijden: {
          create: [
            {
              type: "warmeMaaltijd",
              leverdatum: new Date("2023-12-06"),
              leverplaats: { connect: { naam: "DIENST 1" } },
              hoofdschotel: "lasagne",
              soep: true,
              dessert: "zuivel",
            },
            {
              type: "warmeMaaltijd",
              leverdatum: new Date("2023-12-09"),
              leverplaats: { connect: { naam: "DIENST 2" } },
              hoofdschotel: "suggestie",
              soep: false,
              dessert: "fruit",
              suggestieVanDeMaand: {
                connect: {
                  maand_vegie: {
                    maand: 12,
                    vegie: false,
                  },
                },
              },
            },
          ],
        },
      },
      {
        bestellingsnr: 101,
        besteldatum: new Date("2023-12-07"),
        maaltijden: {
          create: {
            type: "broodMaaltijd",
            leverdatum: new Date("2023-12-12"),
            leverplaats: { connect: { naam: "DIENST 1" } },
            typeSandwiches: "wit",
            soep: true,
            dessert: "zuivel",
            hartigBeleg: "salami",
            zoetBeleg: "confituur",
            vetstof: true,
          },
        },
      },
    ],
  },
};
//id wordt door prisma gegenereerd
const dataMedewerker = {
  naam: "Test",
  voornaam: "User",
  dienst: {
    connect: {
      naam: "DIENST 1",
    },
  },
};
const dataToDelete = {
  bestellingen: [100, 101],
  diensten: [100, 101],
  suggestieVanDeMaand: [100, 101],
};

describe("Bestellingen", () => {
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

  const url = "/api/bestellingen";
  
  describe("GET /api/bestellingen", () => {
    beforeAll(async () => {
      await prisma.dienst.createMany({
        data: testDataDiensten,
      });

      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      await prisma.medewerker.create({
        include: {
          bestellingen: {
            include: {
              maaltijden: true,
            },
          },
        },
        data: testdataMedewerkerBestellingen,
      });
    });

    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      const medewerkerToDelete = await prisma.medewerker.findFirst({
        where: {
          naam: "Test",
          voornaam: "User",
        },
      });
      await prisma.medewerker.delete({
        where: {
          id: medewerkerToDelete.id,
        },
      });
      await prisma.dienst.deleteMany({
        where: {
          id: { in: dataToDelete.diensten },
        },
      });
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
    });

    it("should 200 and return all bestellingen", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items[0]).toEqual({
        bestellingsnr: 100,
        besteldatum: "2023-12-05T00:00:00.000Z",
        //work around
        medewerkerId: expect.anything(),
        medewerker: {
          id: expect.anything(),
          naam: "Test",
          voornaam: "User",
          dienstId: 100,
          dienst: {
            id: 100,
            naam: "DIENST 1",
          },
        },
        maaltijden: [
          {
            id: expect.anything(),
            type: "warmeMaaltijd",
            leverdatum: "2023-12-09T00:00:00.000Z",
            hoofdschotel: "suggestie",
            soep: "geen soep",
            dessert: "fruit",
            typeSandwiches: null,
            hartigBeleg: null,
            zoetBeleg: null,
            vetstof: null,
            leverplaatsId: 101,
            bestellingsnr: 100,
            suggestieVanDeMaandId: 100,
            suggestieVanDeMaand: {
              id: 100,
              maand: 12,
              vegie: false,
              omschrijving: "test suggestie omschrijving december",
            },
            leverplaats: {
              id: 101,
              naam: "DIENST 2",
            },
          },
          {
            id: expect.anything(),
            type: "warmeMaaltijd",
            leverdatum: "2023-12-06T00:00:00.000Z",
            hoofdschotel: "lasagne",
            soep: "dagsoep",
            dessert: "zuivel",
            typeSandwiches: null,
            hartigBeleg: null,
            zoetBeleg: null,
            vetstof: null,
            leverplaatsId: 100,
            bestellingsnr: 100,
            suggestieVanDeMaandId: null,
            suggestieVanDeMaand: null,
            leverplaats: {
              id: 100,
              naam: "DIENST 1",
            },
          },
        ],
      });
    });
  });

  describe("GET /api/bestellingen/:id", () => {
    beforeAll(async () => {
      await prisma.dienst.createMany({
        data: testDataDiensten,
      });

      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      await prisma.medewerker.create({
        include: {
          bestellingen: {
            include: {
              maaltijden: true,
            },
          },
        },
        data: testdataMedewerkerBestellingen,
      });
    });
    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      const medewerkerToDelete = await prisma.medewerker.findFirst({
        where: {
          naam: "Test",
          voornaam: "User",
        },
      });
      await prisma.medewerker.delete({
        where: {
          id: medewerkerToDelete.id,
        },
      });
      await prisma.dienst.deleteMany({
        where: {
          id: { in: dataToDelete.diensten },
        },
      });
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
    });

    it("should 200 and return the requested bestelling", async () => {
      const response = await request.get(`${url}/101`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        bestellingsnr: 101,
        besteldatum: "2023-12-07T00:00:00.000Z",
        //work around
        medewerkerId: expect.anything(),
        medewerker: {
          id: expect.anything(),
          naam: "Test",
          voornaam: "User",
          dienstId: 100,
          dienst: {
            id: 100,
            naam: "DIENST 1",
          },
        },
        maaltijden: [
          {
            id: expect.anything(),
            type: "broodMaaltijd",
            leverdatum: "2023-12-12T00:00:00.000Z",
            hoofdschotel: null,
            soep: "dagsoep",
            dessert: "zuivel",
            typeSandwiches: "wit",
            hartigBeleg: "salami",
            zoetBeleg: "confituur",
            vetstof: "vetstof",
            leverplaatsId: 100,
            bestellingsnr: 101,
            suggestieVanDeMaandId: null,
            suggestieVanDeMaand: null,
            leverplaats: {
              id: 100,
              naam: "DIENST 1",
            },
          },
        ],
      });
    });
  });

  describe("POST /api/bestellingen", () => {
    const bestellingenToDelete = [];
    let medewerkerId;
    beforeAll(async () => {
      //tijd vastzetten zodat er geen latency is in de test voor oproep new Date()
      jestDate.advanceTo("2023-11-07T15:40:40.798Z");
      await prisma.dienst.createMany({
        data: testDataDiensten,
      });

      await prisma.medewerker.create({
        include: { dienst: true },
        data: dataMedewerker,
      });
      const medewerker = await prisma.medewerker.findFirst({
        where: {
          naam: "Test",
          voornaam: "User",
        },
      });
      medewerkerId = medewerker.id;
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });
    });
    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: bestellingenToDelete },
        },
      });
      await prisma.medewerker.delete({
        where: {
          id: medewerkerId,
        },
      });
      await prisma.dienst.deleteMany({
        where: {
          id: { in: dataToDelete.diensten },
        },
      });
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
      //tijd terug vrijgeven
      jestDate.clear();
    });

    it("should 201 and return the created bestelling", async () => {
      const response = await request.post(url).send({
        medewerkerId: medewerkerId,
        maaltijden: [
          {
            type: "warmeMaaltijd",
            hoofdschotel: "vegetarische suggestie",
            soep: "dagsoep",
            dessert: "fruit",
            leverdatum: "2023-12-05T23:13:34.996Z",
            leverplaats: "DIENST 2",
            suggestieVanDeMaandId: 101,
            suggestieVanDeMaand: "test vegie suggestie omschrijving december",
          },
        ],
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        bestellingsnr: expect.anything(),
        besteldatum: new Date().toISOString(),
        medewerkerId: medewerkerId,
        medewerker: {
          id: medewerkerId,
          naam: "Test",
          voornaam: "User",
          dienstId: 100,
        },
        maaltijden: [
          {
            id: expect.anything(),
            type: "warmeMaaltijd",
            leverdatum: "2023-12-05T23:13:34.996Z",
            hoofdschotel: "vegetarische suggestie",
            soep: true,
            dessert: "fruit",
            typeSandwiches: null,
            hartigBeleg: null,
            zoetBeleg: null,
            vetstof: null,
            leverplaatsId: 101,
            bestellingsnr: expect.anything(),
            suggestieVanDeMaandId: 101,
            suggestieVanDeMaand: {
              id: 101,
              maand: 12,
              vegie: true,
              omschrijving: "test vegie suggestie omschrijving december",
            },
            leverplaats: {
              id: 101,
              naam: "DIENST 2",
            },
          },
        ],
      });

      bestellingenToDelete.push(response.body.bestellingsnr);
    });
  });

  describe("DELETE /api/bestellingen/:id", () => {
    beforeAll(async () => {
      await prisma.dienst.createMany({
        data: testDataDiensten,
      });

      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      await prisma.medewerker.create({
        include: {
          bestellingen: {
            include: {
              maaltijden: true,
            },
          },
        },
        data: testdataMedewerkerBestellingen,
      });
    });

    afterAll(async () => {
      await prisma.bestelling.delete({
        where: {
          bestellingsnr: 101,
        },
      });

      const medewerkerToDelete = await prisma.medewerker.findFirst({
        where: {
          naam: "Test",
          voornaam: "User",
        },
      });
      await prisma.medewerker.delete({
        where: {
          id: medewerkerToDelete.id,
        },
      });
      await prisma.dienst.deleteMany({
        where: {
          id: { in: dataToDelete.diensten },
        },
      });
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/100`);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

  });
});
