const axios = require("axios");
const { prepare } = require("../setup/test-helper");
const {
  registerUser,
  loginUser,
  buildAuthHeader
} = require("../setup/scaffolding");

describe("AuthZ ownership tests for orders", () => {
  let ownerConfig = null;
  let otherUserConfig = null;
  let orderId = null;

  beforeAll(async () => {
    // Scaffolding: create two distinct users so we can verify owner vs non-owner access.
    const uniqueSuffix = Date.now();
    const ownerEmail = `testowner_${uniqueSuffix}@test.com`;
    const otherEmail = `testother_${uniqueSuffix}@test.com`;

    await registerUser({
      name: "Owner User",
      email: ownerEmail
    });
    await registerUser({
      name: "Other User",
      email: otherEmail
    });

    const ownerLogin = await loginUser({ email: ownerEmail });
    const otherLogin = await loginUser({ email: otherEmail });

    ownerConfig = buildAuthHeader(ownerLogin.data.accessToken);
    otherUserConfig = buildAuthHeader(otherLogin.data.accessToken);

    const createdOrder = await axios.post(
      prepare("/order"),
      {
        type: "Box1",
        description: "{Test Order Ownership}"
      },
      ownerConfig
    );
    orderId = createdOrder.data._id;
  });

  it("R1-T02: should block non-owner from reading another user's order", async () => {
    // Why this test exists:
    // R1 requires that access is granted only to the owner or an admin.
    // Non-owner access must be denied without leaking order data.
    await axios
      .get(prepare(`/order/${orderId}`), otherUserConfig)
      .catch((error) => {
        expect(error.response.status).toEqual(403);
        expect(error.response.data.type).toEqual(undefined);
        expect(error.response.data.description).toEqual(undefined);
      });
  });

  it("R1-T03: should block non-owner from updating another user's order", async () => {
    // Why this test exists:
    // R1 requires ownership checks on mutations, not just reads.
    await axios
      .put(
        prepare("/order"),
        {
          _id: orderId,
          type: "Box2",
          description: "{Should Not Update}"
        },
        otherUserConfig
      )
      .catch((error) => {
        expect(error.response.status).toEqual(403);
      });
  });

  it("R1-T04: should block non-owner from deleting another user's order", async () => {
    // Why this test exists:
    // R1 requires that non-owners cannot delete resources and that the resource
    // remains intact after a denied request.
    await axios
      .delete(prepare(`/order/${orderId}`), otherUserConfig)
      .catch((error) => {
        expect(error.response.status).toEqual(403);
      });

    const orderStillExists = await axios.get(
      prepare(`/order/${orderId}`),
      ownerConfig
    );
    expect(orderStillExists.status).toEqual(200);
  });
});
