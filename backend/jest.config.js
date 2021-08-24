module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@backend/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
