import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@warpy-be/errors';
import { Injectable } from '@nestjs/common';
import { ParticipantStore } from '@warpy-be/user/participant';
import { BlockEntity } from './block.entity';
import { BlockCacheService } from './block.cache';

@Injectable()
export class BlockService {
  constructor(
    private participantEntity: ParticipantStore,
    private blockEntity: BlockEntity,
    private blockCacheService: BlockCacheService,
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

  async isBannedBySpeaker(user: string, stream: string) {
    //TODO: store stream speakers in redis local
    const streamers = await this.participantEntity.getStreamers(stream);
    const blockedByIds = await this.blockEntity.getBlockedByIds(user);
    const blockedIds = await this.blockEntity.getBlockedUserIds(user);

    const blocker = streamers.find((speaker) =>
      blockedByIds.includes(speaker.id),
    );

    if (blocker) {
      throw new BlockedByAnotherSpeaker({
        last_name: blocker.last_name,
        first_name: blocker.first_name,
      });
    }

    const blockedStreamStreamer = streamers.find((streamer) =>
      blockedIds.includes(streamer.id),
    );

    if (blockedStreamStreamer) {
      throw new StreamHasBlockedSpeakerError({
        last_name: blockedStreamStreamer.last_name,
        first_name: blockedStreamStreamer.first_name,
      });
    }
  }
}
