const jestDate = require("jest-date-mock");

const { withServer, login, loginAdmin } = require("./supertest.setup");
const { testAuthHeader } = require("./common/auth");

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

//id maaltijden worden genereerd door prisma
//medewerkId in de beforeAll opvragen en toevoegen aan de testdata
const testdataBestellingen = [
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
];

const dataToDelete = {
  bestellingen: [100, 101],
  diensten: [100, 101],
  suggestieVanDeMaand: [100, 101],
};

describe("Bestellingen", () => {
  let prisma, request, authHeader;

  withServer(({ supertest, prisma: p }) => {
    request = supertest;
    prisma = p;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/bestellingen";

  describe("GET /api/bestellingen", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });
      const { id: testUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const { id: adminUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[0], medewerkerId: testUserId },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[1], medewerkerId: adminUserId },
      });
    });

    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
      // admin -> user terugzetten
      authHeader = await login(request);
    });

    it("should 200 and return all bestellingen from medewerker", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        bestellingsnr: 100,
        besteldatum: "2023-12-05T00:00:00.000Z",
        //work around
        medewerkerId: expect.anything(),
        medewerker: {
          id: expect.anything(),
          naam: "Test",
          voornaam: "User",
          email: "test.user@hogent.be",
          rollen: '["user"]',
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

    it("should 200 and return all bestellingen (admin)", async () => {
      authHeader = await loginAdmin(request);
      const response = await request.get(url).set("Authorization", authHeader);
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
          email: "test.user@hogent.be",
          rollen: '["user"]',
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
    testAuthHeader(() => request.get(url));
  });

  describe("GET /api/bestellingen/:id", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      const { id: testUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const { id: testAdminId } = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[0], medewerkerId: testAdminId },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[1], medewerkerId: testUserId },
      });
    });
    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
      // admin -> user terugzetten
      authHeader = await login(request);
    });

    it("should 200 and return the requested bestelling from medewerker", async () => {
      const response = await request
        .get(`${url}/101`)
        .set("Authorization", authHeader);

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
          email: "test.user@hogent.be",
          rollen: '["user"]',
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

    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request
        .get(`${url}/100`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om deze actie uit te voeren"
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });
    it("should 200 and return the requested medewerker bestelling (admin)", async () => {
      authHeader = await loginAdmin(request);
      const response = await request
        .get(`${url}/101`)
        .set("Authorization", authHeader);

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
          email: "test.user@hogent.be",
          rollen: '["user"]',
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

    testAuthHeader(() => request.get(url));
  });

  describe("POST /api/bestellingen", () => {
    const bestellingenToDelete = [];

    beforeAll(async () => {
      //tijd vastzetten zodat er geen latency is in de test voor oproep new Date()
      jestDate.advanceTo("2023-11-07T15:40:40.798Z");

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
      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
      //tijd terug vrijgeven
      jestDate.clear();
    });

    it("should 201 and return the created bestelling", async () => {
      const { id: medewerkerId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
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
          email: "test.user@hogent.be",
          rollen: '["user"]',
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
    testAuthHeader(() => request.get(url));
  });

  describe("DELETE /api/bestellingen/:id", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      const { id: testUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const { id: testAdminId } = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[0], medewerkerId: testUserId },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[1], medewerkerId: testAdminId },
      });
    });

    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/100`)
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request
        .delete(`${url}/101`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om deze actie uit te voeren"
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });
    testAuthHeader(() => request.get(url));
  });

  describe("GET /api/bestellingen/leverdata", () => {
    beforeAll(async () => {
      await prisma.suggestieVanDeMaand.createMany({
        data: testDataSuggestieVanDeMaand,
      });

      const { id: testUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const { id: testAdminId } = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[0], medewerkerId: testUserId },
      });
      await prisma.bestelling.create({
        include: {
          maaltijden: true,
        },
        data: { ...testdataBestellingen[1], medewerkerId: testAdminId },
      });
    });

    afterAll(async () => {
      await prisma.bestelling.deleteMany({
        where: {
          bestellingsnr: { in: dataToDelete.bestellingen },
        },
      });

      await prisma.suggestieVanDeMaand.deleteMany({
        where: {
          id: { in: dataToDelete.suggestieVanDeMaand },
        },
      });
      authHeader = await login(request);
    });

    it("should 200 and return all leverdata of medewerker", async () => {
      const response = await request
        .get(`${url}/leverdata`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toContain(
        new Date("2023-12-06").toISOString()
      );
      expect(response.body.items).toContain(
        new Date("2023-12-09").toISOString()
      );
    });
    it("should 200 and return all leverdata (as admin)", async () => {
      authHeader = await loginAdmin(request);
      const response = await request
        .get(`${url}/leverdata`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.items).toContain(
        new Date("2023-12-06").toISOString()
      );
      expect(response.body.items).toContain(
        new Date("2023-12-09").toISOString()
      );
      expect(response.body.items).toContain(
        new Date("2023-12-12").toISOString()
      );
    });
    testAuthHeader(() => request.get(url));
  });
});
