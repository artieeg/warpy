import { createFollowRecord } from '@backend_2/__fixtures__';

export const mockedFollowEntity = {
  createNewFollow: jest.fn().mockResolvedValue(createFollowRecord),
  deleteFollow: jest.fn(),
};
