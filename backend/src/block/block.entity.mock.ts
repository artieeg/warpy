import { NjsBlockStore } from './block.entity';

export const mockedBlockEntity: jest.Mocked<Partial<NjsBlockStore>> = {
  create: jest.fn().mockResolvedValue('id'),
  deleteById: jest.fn(),
  getBlockedByIds: jest.fn().mockResolvedValue(['id1']),
  getBlockedUserIds: jest.fn().mockResolvedValue(['id2']),
  getBlockedUsers: jest.fn().mockRejectedValue(new Error('unimplemented')),
};
