const testTokenValue = 'test-token';

export const mockedTokenService = {
  testTokenValue,
  createToken: jest.fn().mockReturnValue(testTokenValue),
};
