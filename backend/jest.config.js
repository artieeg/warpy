module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  timers: "fake",
  moduleNameMapper: {
    '^@backend/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
