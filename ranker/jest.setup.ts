import "redis-mock";

jest.mock("redis", () => jest.requireActual("redis-mock"));
