const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../../endpoints/auth");
const { User } = require("../../models/user");

jest.mock("jsonwebtoken");
jest.mock("../../models/user", () => ({
  User: {
    findOne: jest.fn()
  }
}));

const buildResponse = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  sendStatus: jest.fn()
});

describe("Auth middleware structural tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no bearer token is provided", () => {
    const req = { headers: {} };
    const res = buildResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should attach user role and call next on valid token", async () => {
    const req = { headers: { authorization: "Bearer valid.token" } };
    const res = buildResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: "user-id" });
    });
    User.findOne.mockResolvedValue({ role: "User" });

    await new Promise((resolve) => {
      authenticateToken(req, res, () => {
        next();
        resolve();
      });
    });

    expect(req.user).toEqual({ id: "user-id", role: "User" });
    expect(next).toHaveBeenCalled();
  });
});
