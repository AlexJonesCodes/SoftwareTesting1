// Scaffolding helper for tests:
// This file centralizes small utilities used across multiple tests so that
// each test can focus on AAA (Arrange/Act/Assert) without duplicating boilerplate.
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
  // Scaffolding: register a user using the public API so tests can rely on
  // realistic flows (hashing, validation, persistence) rather than direct DB writes.
  return axios.post(prepare("/register"), {
    name,
    role,
    email,
    password,
    address
  });
};

const loginUser = async ({ email, password = DEFAULT_PASSWORD }) => {
  // Scaffolding: authenticate using the same endpoint as clients to retrieve JWTs.
  return axios.post(prepare("/login"), {
    email,
    password
  });
};

const buildAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const signTokenWithSecret = ({ userId, secret }) => {
  // Scaffolding: create a JWT with a caller-provided secret to simulate
  // invalid signatures or test custom token scenarios.
  return jwt.sign({ id: userId }, secret, { expiresIn: 86400 });
};

module.exports = {
  DEFAULT_PASSWORD,
  registerUser,
  loginUser,
  buildAuthHeader,
  signTokenWithSecret
};
