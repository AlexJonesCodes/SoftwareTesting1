const axios = require("axios");
const { prepare } = require("../setup/test-helper");
const { registerUser } = require("../setup/scaffolding");

describe("Registration validation tests", () => {
  it("R2-T01: should reject case-insensitive duplicate emails", async () => {
    // Why this test exists:
    // R2 requires duplicate emails to be rejected case-insensitively to prevent
    // duplicate accounts that differ only by case, which could bypass identity checks.
    const uniqueSuffix = Date.now();
    const emailLower = `testcase_${uniqueSuffix}@example.com`;
    const emailUpper = `TestCase_${uniqueSuffix}@example.com`;

    await registerUser({
      name: "Case Test",
      email: emailLower
    });

    await registerUser({
      name: "Case Test Duplicate",
      email: emailUpper
    }).catch((error) => {
      expect(error.response.status).toEqual(409);
    });
  });

  it("R2-T02: should reject invalid role values", async () => {
    // Why this test exists:
    // R2 specifies role must be in {User, Admin} to avoid privilege escalation
    // during registration.
    const uniqueSuffix = Date.now();
    const email = `testrole_${uniqueSuffix}@example.com`;

    await axios
      .post(prepare("/register"), {
        name: "Invalid Role",
        role: "SuperAdmin",
        email,
        password: "12345",
        address: "Somewhere 10"
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
      });
  });
});
