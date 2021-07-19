module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@video/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [
    "./jest.setup.ts"
  ]
};
