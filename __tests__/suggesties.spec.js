const { withServer, login, loginAdmin } = require("./supertest.setup");
const { testAuthHeader } = require("./common/auth");

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
  let prisma, request, authHeader;
  withServer(({ supertest, prisma: p }) => {
    request = supertest;
    prisma = p;
  });

  beforeAll(async () => {
    authHeader = await login(request);
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
      const response = await request.get(url).set("Authorization", authHeader);
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
    testAuthHeader(() => request.get(url));
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
      const response = await request
        .get(`${url}?maand=12&vegie=true`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        omschrijving: "test vegie suggestie omschrijving december",
      });
    });
    it("should 400 and return message (foute maand)", async () => {
      const response = await request
        .get(`${url}?maand=13&vegie=true`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Validation failed, check details for more information"
      );
      expect(response.body.code).toBe("VALIDATION_FAILED");
    });

    testAuthHeader(() => request.get(url));
  });
});
