export const mockedNatsService = {
  jc: {
    encode: jest.fn().mockReturnValue('encoded-msg'),
  },
  publish: jest.fn(),
  request: jest.fn(),
};
