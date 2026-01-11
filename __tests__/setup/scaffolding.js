// Scaffolding helper for tests:
// This file intentionally provides reusable, non-asserting helpers that make it
// easier to set up test preconditions. It is *not* a behavioral test itself.
// Keeping this logic here reduces duplication and keeps each test focused on
// Arrange/Act/Assert and the LO1 requirement it is evidencing.
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { prepare } = require("./test-helper");

const DEFAULT_PASSWORD = "12345";

const registerUser = async ({
  name,
  email,
  password = DEFAULT_PASSWORD,
  address = "Somewhere 10",
  role = "User"
}) => {
  // Scaffolding helper:
  // We register via the public API to exercise real behavior (validation,
  // hashing, persistence). This avoids bypassing logic with direct DB writes
  // and gives more credible evidence for LO1 requirements.
  return axios.post(prepare("/register"), {
    name,
    role,
    email,
    password,
    address
  });
};

const loginUser = async ({ email, password = DEFAULT_PASSWORD }) => {
  // Scaffolding helper:
  // We log in via the same endpoint used by clients to obtain real JWTs
  // for protected-route tests. This ensures tokens match actual runtime behavior.
  return axios.post(prepare("/login"), {
    email,
    password
  });
};

const buildAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const signTokenWithSecret = ({ userId, secret }) => {
  // Scaffolding helper:
  // This helper signs a token with a custom secret so tests can explicitly
  // prove that only API_SECRET-signed tokens are accepted (invalid signature tests).
  return jwt.sign({ id: userId }, secret, { expiresIn: 86400 });
};

module.exports = {
  DEFAULT_PASSWORD,
  registerUser,
  loginUser,
  buildAuthHeader,
  signTokenWithSecret
};
