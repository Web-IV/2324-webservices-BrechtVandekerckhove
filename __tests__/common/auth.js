const testAuthHeader = (requestFactory) => {
  test("it should 401 when no authorization token provided", async () => {
    const response = await requestFactory();

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED");
    expect(response.body.message).toBe("Je moet ingelogd zijn");
  });

  test("it should 401 when invalid authorization token provided", async () => {
    const response = await requestFactory().set(
      "Authorization",
      "INVALID TOKEN"
    );

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED");
    expect(response.body.message).toBe("Invalid authentication token");
  });
};

module.exports = {
  testAuthHeader,
};
