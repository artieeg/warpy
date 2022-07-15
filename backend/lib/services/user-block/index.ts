import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@warpy-be/errors';
import { IUser } from '@warpy/lib';
import {
  IStreamerIdStore,
  IUserBlockCacheStore,
  IUserBlockStore,
} from 'lib/stores';

export interface IUserBlockService {
  unblockUser(blocker: string, blocked: string): Promise<void>;
  getBlockedUserIds(user: string): Promise<string[]>;
  getBlockedByIds(user: string): Promise<string[]>;
  blockUser(blocker: string, blocked: string): Promise<string>;
  getBlockedUsers(user: string, page: number): Promise<IUser[]>;
  isBannedBySpeaker(user: string, stream: string): Promise<void>;
}

export class UserBlockService implements IUserBlockService {
  constructor(
    private blockEntity: IUserBlockStore,
    private blockCacheService: IUserBlockCacheStore,
    private streamerIdStore: IStreamerIdStore,
  ) {}

  async unblockUser(blocker: string, blocked: string) {
    await Promise.all([
      //Update database
      this.blockEntity.deleteByUsers(blocker, blocked),

      //Reset cache
      this.blockCacheService.delBlockedUserIds(blocker),
      this.blockCacheService.delBlockedByUsers(blocked),
    ]);
  }

  async getBlockedUserIds(user: string) {
    const cached_ids = await this.blockCacheService.getBlockedUserIds(user);

    if (!cached_ids) {
      const ids = await this.blockEntity.getBlockedUserIds(user);
      this.blockCacheService.setBlockedUserIds(user, ids);

      return ids;
    }

    return cached_ids;
  }

  async getBlockedByIds(user: string) {
    const cached_ids = await this.blockCacheService.getBlockedByIds(user);

    if (!cached_ids) {
      const ids = await this.blockEntity.getBlockedByIds(user);
      this.blockCacheService.setBlockedByIds(user, ids);

      return ids;
    }

    return cached_ids;
  }

  async blockUser(blocker: string, blocked: string) {
    const [, , blockId] = await Promise.all([
      //Reset cache
      this.blockCacheService.delBlockedUserIds(blocker),
      this.blockCacheService.delBlockedByUsers(blocked),

      //Create db record
      await this.blockEntity.create({
        blocker,
        blocked,
      }),
    ]);

    return blockId;
  }

  async getBlockedUsers(user: string, _page: number): Promise<IUser[]> {
    const blocked = await this.blockEntity.getBlockedUsers(user);

    return blocked.map((record) => record.blocked);
  }

  async isBannedBySpeaker(user: string, stream: string) {
    const streamerIds = await this.streamerIdStore.get(stream);
    const blockedByIds = await this.blockEntity.getBlockedByIds(user);
    const blockedIds = await this.blockEntity.getBlockedUserIds(user);

    const blocker = streamerIds.find((streamer) =>
      blockedByIds.includes(streamer),
    );

    if (blocker) {
      throw new BlockedByAnotherSpeaker();
    }

    const blockedStreamStreamer = streamerIds.find((streamer) =>
      blockedIds.includes(streamer),
    );

    if (blockedStreamStreamer) {
      throw new StreamHasBlockedSpeakerError();
    }
  }
}
