const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { registerUser } = require("../setup/scaffolding");

require("dotenv").config({ path: ".env" });

describe("Registration security tests", () => {
  beforeAll(async () => {
    // Scaffolding setup:
    // Connect directly to MongoDB so we can inspect the stored password hash.
    // The bcrypt cost factor (rounds) is only observable in the DB record.
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DB_ENDPOINT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("R2-T03: should store bcrypt hash with cost factor 8", async () => {
    // Why this test exists:
    // R2 requires bcrypt hashing with cost factor 8 to ensure password storage
    // is sufficiently strong and consistent across registrations.
    const uniqueSuffix = Date.now();
    const email = `testbcrypt_${uniqueSuffix}@example.com`;
    const plaintextPassword = "12345";

    await registerUser({
      name: "Bcrypt Test",
      email,
      password: plaintextPassword
    });

    const userRecord = await User.findOne({ email });
    expect(userRecord.password).not.toEqual(plaintextPassword);
    expect(bcrypt.getRounds(userRecord.password)).toEqual(8);
  });
});
