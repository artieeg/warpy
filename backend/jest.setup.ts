import "redis-mock";

jest.mock("redis", () => jest.requireActual("redis-mock"));

jest.mock("@backend/services/message");
jest.mock("@backend/services/broadcast");
jest.mock("@backend/services/media");
jest.mock("@backend/services/feed");
jest.mock("@backend/dal/stream_dal");
jest.mock("@backend/dal/participant_dal");
jest.mock("@backend/dal/user_dal");
jest.mock("@prisma/client");

process.env = {
  MONGODB_CONN: "mongodb://mongo:27017",
  PARTICIPANTS_CACHE: "warpy_redis_1",
  NATS_ADDR: "warpy_nats_1",
  PORT: "10000",
};
