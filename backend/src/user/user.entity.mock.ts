import { createUserFixture } from '@warpy-be/__fixtures__';

export const mockedUserEntity = {
  findById: jest.fn().mockResolvedValue(createUserFixture({})),
  search: jest
    .fn()
    .mockResolvedValue([createUserFixture({}), createUserFixture({})]),
  createNewUser: jest.fn().mockResolvedValue(createUserFixture({})),
  delete: jest.fn(),
};
