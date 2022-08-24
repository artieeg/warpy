import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@warpy-be/errors';
import { getMockedInstance } from '@warpy-be/utils';
import { createUserBlockFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { StreamerIdStore } from './streamer-ids.store';
import { UserBlockCacheStore } from './user-block.cache';
import { UserBlockService } from './user-block.service';
import { UserBlockStore } from './user-block.store';

describe('UserBlockService', () => {
  const userBlockStore = getMockedInstance<UserBlockStore>(UserBlockStore);
  const blockCacheStore =
    getMockedInstance<UserBlockCacheStore>(UserBlockCacheStore);
  const streamerIdStore = getMockedInstance<StreamerIdStore>(StreamerIdStore);

  const service = new UserBlockService(
    userBlockStore as any,
    blockCacheStore as any,
    streamerIdStore as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checking user', () => {
    const userBlockedByOtherStreamer = 'user-blocked-by-streamer';
    const userBlockingOtherStreamer = 'user-blocking-streamer';
    const user = 'block-check-user0';

    const stream = 'stream0';

    const streamers = ['user0', 'user1'];

    userBlockStore.getBlockedByIds.mockResolvedValue([]);
    userBlockStore.getBlockedUserIds.mockResolvedValue([]);

    streamerIdStore.get.mockResolvedValue(streamers);

    when(userBlockStore.getBlockedUserIds)
      .calledWith(userBlockingOtherStreamer)
      .mockResolvedValue([streamers[0]]);

    when(userBlockStore.getBlockedByIds)
      .calledWith(userBlockedByOtherStreamer)
      .mockResolvedValue([streamers[1]]);

    it('throws if user is blocking another streamer', () => {
      expect(
        service.checkUser(userBlockingOtherStreamer, stream),
      ).rejects.toThrowError(StreamHasBlockedSpeakerError);
    });

    it('throws if user has been blocked by another streamer', () => {
      expect(
        service.checkUser(userBlockedByOtherStreamer, stream),
      ).rejects.toThrowError(BlockedByAnotherSpeaker);
    });
  });

  describe('getting blocked user data', () => {
    const blocks = [
      createUserBlockFixture(),
      createUserBlockFixture(),
      createUserBlockFixture(),
    ];

    userBlockStore.getBlockedUsers.mockResolvedValue(blocks);

    it('returns blocked users', async () => {
      expect(service.getBlockedUsers('user', 0)).resolves.toStrictEqual(
        blocks.map((b) => b.blocked),
      );
    });
  });

  describe('blocking users', () => {
    const blockId = 'block0';

    const blocker = 'user0';
    const blocked = 'user1';

    userBlockStore.create.mockResolvedValue(blockId);

    it('creates block record', () => {
      expect(service.blockUser(blocked, blocker)).resolves.toStrictEqual(
        blockId,
      );
    });

    it('resets cache', async () => {
      await service.blockUser(blocker, blocked);

      expect(blockCacheStore.delBlockedByUsers).toBeCalledWith(blocked);
      expect(blockCacheStore.delBlockedUserIds).toBeCalledWith(blocker);
    });
  });

  describe('getting ids of users that blocked us', () => {
    const userWithCache = 'block-cached-user';
    const ids = ['user0', 'user1'];

    const userWithoutCache = 'block-not-cached-user';

    when(blockCacheStore.getBlockedByIds)
      .calledWith(userWithoutCache)
      .mockResolvedValue(null);
    when(blockCacheStore.getBlockedByIds)
      .calledWith(userWithCache)
      .mockResolvedValue(ids);

    when(userBlockStore.getBlockedByIds)
      .calledWith(userWithoutCache)
      .mockResolvedValue(ids);

    it('uses cache when possible', async () => {
      const blockedByIds = await service.getBlockedByIds(userWithCache);
      expect(blockedByIds).toStrictEqual(ids);
      expect(userBlockStore.getBlockedByIds).not.toBeCalled();
    });

    it('sets cache if its empty', async () => {
      await service.getBlockedByIds(userWithoutCache);
      expect(blockCacheStore.setBlockedByIds).toBeCalledWith(
        userWithoutCache,
        ids,
      );
    });

    it('fetches blocked by ids from db if cache is clear', async () => {
      const blockedByIds = await service.getBlockedByIds(userWithoutCache);

      expect(userBlockStore.getBlockedByIds).toBeCalledWith(userWithoutCache);
      expect(blockedByIds).toStrictEqual(ids);
    });
  });

  describe('getting blocked user ids', () => {
    const userWithCache = 'block-cached-user';
    const ids = ['user0', 'user1'];

    const userWithoutCache = 'block-not-cached-user';

    when(blockCacheStore.getBlockedUserIds)
      .calledWith(userWithoutCache)
      .mockResolvedValue(null);
    when(blockCacheStore.getBlockedUserIds)
      .calledWith(userWithCache)
      .mockResolvedValue(ids);

    when(userBlockStore.getBlockedUserIds)
      .calledWith(userWithoutCache)
      .mockResolvedValue(ids);

    it('uses cache when possible', async () => {
      const blockedIds = await service.getBlockedUserIds(userWithCache);
      expect(blockedIds).toStrictEqual(ids);
      expect(userBlockStore.getBlockedUserIds).not.toBeCalled();
    });

    it('sets cache if its empty', async () => {
      await service.getBlockedUserIds(userWithoutCache);
      expect(blockCacheStore.setBlockedUserIds).toBeCalledWith(
        userWithoutCache,
        ids,
      );
    });

    it('fetches blocked ids from db if cache is clear', async () => {
      const blockedUserIds = await service.getBlockedUserIds(userWithoutCache);

      expect(userBlockStore.getBlockedUserIds).toBeCalledWith(userWithoutCache);
      expect(blockedUserIds).toStrictEqual(ids);
    });
  });

  describe('unblocking user', () => {
    const blocker = 'blocker0';
    const blocked = 'blocked0';

    it('clears block cache', async () => {
      await service.unblockUser(blocker, blocked);

      expect(blockCacheStore.delBlockedByUsers).toBeCalledWith(blocked);
      expect(blockCacheStore.delBlockedUserIds).toBeCalledWith(blocker);
    });

    it('deletes the block record', async () => {
      await service.unblockUser(blocker, blocked);
      expect(userBlockStore.deleteByUsers).toBeCalledWith(blocker, blocked);
    });
  });
});
