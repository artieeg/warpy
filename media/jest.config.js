module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@media/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [
    "./jest.setup.ts"
  ]
};
