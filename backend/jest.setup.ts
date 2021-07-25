import "redis-mock";

jest.mock("redis", () => jest.requireActual("redis-mock"));

process.env = {
  MONGODB_CONN: "mongodb://mongo:27017",
  PARTICIPANTS_CACHE: "warpy_redis_1",
  NATS_ADDR: "warpy_nats_1",
  PORT: "10000",
};
