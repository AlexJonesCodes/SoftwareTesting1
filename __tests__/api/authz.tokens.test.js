const axios = require("axios");
const { prepare } = require("../setup/test-helper");
const {
  loginUser,
  registerUser,
  buildAuthHeader,
  signTokenWithSecret
} = require("../setup/scaffolding");

describe("AuthZ/AuthN token handling tests", () => {
  it("R1-T01: should reject a JWT signed with the wrong secret", async () => {
    // Why this test exists:
    // R1 requires protected routes to accept ONLY tokens signed with API_SECRET.
    // A wrong-secret token must be rejected to prevent token forgery.
    const adminLogin = await loginUser({
      email: "test@test.com"
    });

    const invalidToken = signTokenWithSecret({
      userId: adminLogin.data.user.id,
      secret: "WRONG_SECRET"
    });

    await axios
      .get(prepare("/orders/all"), buildAuthHeader(invalidToken))
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data).toEqual({
          message: "Unauthorized access."
        });
      });
  });

  it("R1-T05: should reject access with a token belonging to a deleted user", async () => {
    // Why this test exists:
    // R1 requires that tokens belong to an existing user. Once a user is deleted,
    // their token should no longer authorize access.
    const uniqueSuffix = Date.now();
    const email = `testdelete_${uniqueSuffix}@test.com`;

    await registerUser({
      name: "User To Delete",
      email
    });

    const userLogin = await loginUser({ email });
    const { accessToken, user } = userLogin.data;

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
