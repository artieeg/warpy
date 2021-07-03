import mockedEnv from "mocked-env";

process.env = {
  MONGODB_CONN: "mongodb://mongo:27017",
  JWT_SECRET: "warpy-dev-jwt-key",
  NATS_ADDR: "warpy_nats_1",
  PORT: "10000",
};
