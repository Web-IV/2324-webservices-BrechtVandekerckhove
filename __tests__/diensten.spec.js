
const { withServer, login, loginAdmin } = require("./supertest.setup");
const { testAuthHeader } = require("./common/auth");



describe("Diensten", () => {
  let prisma, request, authHeader;
  withServer(({ supertest, prisma: p }) => {
    request = supertest;
    prisma = p;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/diensten";

  describe("GET /api/diensten", () => {
    beforeAll(async () => {
      //niks (global setup)
    });

    afterAll(async () => {
    //niks (global setup)
    });

    it("should 200 and return all diensten", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
      const dienst1 = { id: 100, naam: "DIENST 1" };
      const dienst2 = { id: 101, naam: "DIENST 2" };
      expect(response.body.items).toContainEqual(dienst1);
      expect(response.body.items).toContainEqual(dienst2);
    });
    testAuthHeader(() => request.get(url));
  });
});
