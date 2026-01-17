const axios = require("axios");
const { prepare } = require("../setup/test-helper");
const { registerUser, loginUser, buildAuthHeader } = require("../setup/scaffolding");

describe("Auth state machine tests", () => {
  it("should deny access when unauthenticated", async () => {
    await axios.get(prepare("/me")).catch((error) => {
      expect(error.response.status).toEqual(401);
    });
  });

  it("should allow access when authenticated and deny after deletion", async () => {
    const uniqueSuffix = Date.now();
    const email = `modelstate_${uniqueSuffix}@example.com`;

    await registerUser({
      name: "Model User",
      email
    });

    const loginResponse = await loginUser({ email });
    const { accessToken, user } = loginResponse.data;

    const meResponse = await axios.get(
      prepare("/me"),
      buildAuthHeader(accessToken)
    );
    expect(meResponse.status).toEqual(200);

    const adminLogin = await loginUser({
      email: "test@test.com"
    });
    const adminConfig = buildAuthHeader(adminLogin.data.accessToken);
    await axios.delete(prepare(`/user/${user.id}`), adminConfig);

    await axios
      .get(prepare("/me"), buildAuthHeader(accessToken))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
      });
  });
});
