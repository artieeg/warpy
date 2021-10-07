import { createStreamFixture } from '@backend_2/__fixtures__';

export const mockedStreamEntity = {
  get: jest.fn(),
  create: jest.fn().mockResolvedValue(createStreamFixture({})),
  stop: jest.fn(),
  setPreviewClip: jest.fn(),
};
