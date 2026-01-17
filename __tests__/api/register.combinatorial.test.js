const axios = require("axios");
const { prepare } = require("../setup/test-helper");
const { registerUser } = require("../setup/scaffolding");

describe("Registration combinatorial tests", () => {
  it("should accept valid role/email combinations", async () => {
    const cases = [
      { role: "User" },
      { role: "Admin" }
    ];

    for (const { role } of cases) {
      const uniqueSuffix = Date.now() + Math.random();
      const email = `combovalid_${uniqueSuffix}@example.com`;
      const response = await registerUser({
        name: "Combo Valid",
        email,
        role
      });
      expect(response.status).toEqual(201);
    }
  });

  it("should reject invalid combinations of email, role, and address", async () => {
    const cases = [
      {
        label: "invalid email",
        payload: {
          name: "Combo Invalid",
          email: "invalid-email",
          role: "User",
          password: "12345",
          address: "Somewhere 10"
        },
        expectedStatus: 400
      },
      {
        label: "invalid role",
        payload: {
          name: "Combo Invalid",
          email: `combobadrole_${Date.now()}@example.com`,
          role: "SuperAdmin",
          password: "12345",
          address: "Somewhere 10"
        },
        expectedStatus: 400
      },
      {
        label: "missing address",
        payload: {
          name: "Combo Invalid",
          email: `combomissing_${Date.now()}@example.com`,
          role: "User",
          password: "12345"
        },
        expectedStatus: 400
      }
    ];

    for (const { payload, expectedStatus } of cases) {
      await axios.post(prepare("/register"), payload).catch((error) => {
        expect(error.response.status).toEqual(expectedStatus);
      });
    }
  });
});
