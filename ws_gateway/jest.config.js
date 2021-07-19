module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@ws_gateway/(.*)$': '<rootDir>/src/$1',
  },
};
