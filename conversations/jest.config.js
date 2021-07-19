module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@conv/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
