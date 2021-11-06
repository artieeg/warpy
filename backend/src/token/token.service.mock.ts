const testTokenValue = 'test-token';

export const mockedTokenService = {
  testTokenValue,
  decodeToken: jest.fn(),
  createAuthToken: jest.fn().mockReturnValue(testTokenValue),
  createToken: jest.fn().mockReturnValue(testTokenValue),
};
