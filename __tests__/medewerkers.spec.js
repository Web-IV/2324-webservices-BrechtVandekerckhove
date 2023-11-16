const Role = require("../src/core/rollen");

const { withServer, login, loginAdmin } = require("./supertest.setup");
const { testAuthHeader } = require("./common/auth");

describe("Medewerkers", () => {
  let prisma, request, authHeader;
  withServer(({ supertest, prisma: p }) => {
    request = supertest;
    prisma = p;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/medewerkers";

  describe("GET /api/medewerkers", () => {
    beforeAll(async () => {
      //niks (global setup)
    });

    afterAll(async () => {
      // admin -> user terugzetten
      authHeader = await login(request);
    });
    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om deze actie uit te voeren."
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });

    it("should 200 and return all medewerkers (as admin)", async () => {
      authHeader = await loginAdmin(request);
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
      const user = {
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
      };
      const admin = {
        id: expect.anything(),
        naam: "Admin",
        voornaam: "User",
        email: "admin.user@hogent.be",
        rollen: '["admin","user"]',
        dienstId: 101,
        dienst: {
          id: 101,
          naam: "DIENST 2",
        },
      };
      expect(response.body.items).toContainEqual(user);
      expect(response.body.items).toContainEqual(admin);
    });
    testAuthHeader(() => request.get(url));
  });

  describe("GET /api/medewerkers/:id", () => {
    let testUser, testAdmin;
    beforeAll(async () => {
      testUser = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      testAdmin = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
    });

    afterAll(async () => {
      // admin -> user terugzetten
      authHeader = await login(request);
    });
    it("should 200 and return correct medewerker", async () => {
      const response = await request
        .get(`${url}/${testUser.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });
    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request
        .get(`${url}/${testAdmin.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om de gegevens van deze gebruiker te bekijken."
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });
    it("should 200 and return correct medewerker (as admin)", async () => {
      authHeader = await loginAdmin(request);
      const response = await request
        .get(`${url}/${testUser.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      });
    });
    it("should 404 and return message (non existing user as admin)", async () => {
      const response = await request
        .get(`${url}/99999999999`)
        .set("Authorization", authHeader);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "Geen medewerker gevonden met id 99999999999"
      );
    });

    testAuthHeader(() => request.get(url));
  });
  describe("PUT /api/medewerkers/:id", () => {
    let testUser, testAdmin;
    beforeAll(async () => {
      testUser = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      testAdmin = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
    });

    afterAll(async () => {
      // admin -> user terugzetten
      authHeader = await login(request);
    });
    it("should 200 and return changed medewerker", async () => {
      // dienst aanpassen naar DIENST 2
      const response = await request
        .put(`${url}/${testUser.id}`)
        .send({
          naam: "Test",
          voornaam: "User",
          email: "test.user@hogent.be",
          huidigWachtwoord: "12345678",
          dienst: "DIENST 2",
        })
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: testUser.id,
        naam: "Test",
        voornaam: "User",
        email: "test.user@hogent.be",
        rollen: '["user"]',
        dienstId: 101,
        dienst: {
          id: 101,
          naam: "DIENST 2",
        },
      });
    });
    it("should 400 and return message", async () => {
      // parameter te kort meegeven
      const response = await request
        .put(`${url}/${testUser.id}`)
        .send({
          naam: "Test",
          email: "test.user@hogent.be",
          huidigWachtwoord: "12345678",
          dienst: "DIENST 2",
        })
        .set("Authorization", authHeader);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Validation failed, check details for more information"
      );
  });
 

    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request
        .put(`${url}/${testAdmin.id}`)
        .send({
          naam: "Admin",
          voornaam: "Nieuwe voornaam",
          email: "test.user@hogent.be",
          huidigWachtwoord: "12345678",
          dienst: "DIENST 2",
        })
        .set("Authorization", authHeader);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om de gegevens van deze gebruiker te bekijken."
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });
    
    //dienst hier terug goedzetten voor andere testen
    it("should 200 and return changed medewerker (as Admin)", async () => {
      authHeader = await loginAdmin(request);
      // dienst aanpassen naar DIENST 2
      const response = await request
        .put(`${url}/${testUser.id}`)
        .send({
          naam: "Test",
          voornaam: "User",
          email: "test.user@hogent.be",
          huidigWachtwoord: "12345678",
          dienst: "DIENST 1",
        })
        .set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: testUser.id,
        naam: "Test",
        voornaam: "User",
        email: "test.user@hogent.be",
        rollen: '["user"]',
        dienstId: 100,
        dienst: {
          id: 100,
          naam: "DIENST 1",
        },
      });
    });

    testAuthHeader(() => request.get(url));
  });

  describe("DELETE /api/medewerkers/:id", () => {
    let testUser, testAdmin;
    beforeAll(async () => {
      testUser = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      testAdmin = await prisma.medewerker.findFirst({
        where: {
          email: "admin.user@hogent.be",
        },
      });
    });

    afterAll(async () => {
      // admin -> user terugzetten
      authHeader = await login(request);
    });
    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/${testUser.id}`)
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});

      //direct terug toevoegen
      const testMedewerker1 = await prisma.medewerker.create({
        data: {
          naam: "Test",
          voornaam: "User",
          email: "test.user@hogent.be",
          wachtwoord_hash:
            "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
          rollen: JSON.stringify([Role.USER]),
          dienst: {
            connect: {
              naam: "DIENST 1",
            },
          },
        },
      });
    });

    it("should 403 and return message (unauthorized request)", async () => {
      const response = await request
        .delete(`${url}/${testAdmin.id}`)
        .set("Authorization", authHeader);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Je bent niet gemachtigd om de gegevens van deze gebruiker te bekijken."
      );
      expect(response.body.code).toBe("FORBIDDEN");
    });

    it("should 204 and return nothing (as admin)", async () => {
      authHeader = await loginAdmin(request);
      const { id: testUserId } = await prisma.medewerker.findFirst({
        where: {
          email: "test.user@hogent.be",
        },
      });
      const response = await request
        .delete(`${url}/${testUserId}`)
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});

      //direct terug toevoegen
      const testMedewerker1 = await prisma.medewerker.create({
        data: {
          naam: "Test",
          voornaam: "User",
          email: "test.user@hogent.be",
          wachtwoord_hash:
            "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
          rollen: JSON.stringify([Role.USER]),
          dienst: {
            connect: {
              naam: "DIENST 1",
            },
          },
        },
      });
    });

    testAuthHeader(() => request.get(url));
  });

  //register testen, hoe?? nu code 405
  /*
  describe("POST /api/medewerkers/register", () => {
    beforeAll(async () => {
      // niks
    });

    afterAll(async () => {
      authHeader = await login(request);
    });

    it("should 200 and return created medewerker", async () => {
  
      const response = await request.post(url).send({
        naam: "NieuweTest",
        voornaam: "NieuweUser",
        email: "testtest@hogent.be",
        wachtwoord: "12345678910",
        dienst: "DIENST 1",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        token: expect.anything(),
        medewerker: {
          naam: "NieuweTest",
          voornaam: "NieuweUser",
          email: "testtest@hogent.be",
          dienstId: 100,
          dienst: {
            id: 100,
            naam: "DIENST 1",
          },
        },
      });
    });
  });*/
});
