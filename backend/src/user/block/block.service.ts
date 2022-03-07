import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { ParticipantEntity } from '@backend_2/user/participant/common/participant.entity';
import { BlockEntity } from './block.entity';
import { BlockCacheService } from './block.cache';

@Injectable()
export class BlockService {
  constructor(
    private participantEntity: ParticipantEntity,
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
    const speakers = await this.participantEntity.getSpeakers(stream);
    const blockedByIds = await this.blockEntity.getBlockedByIds(user);
    const blockedIds = await this.blockEntity.getBlockedUserIds(user);

    const blocker = speakers.find((speaker) =>
      blockedByIds.includes(speaker.id),
    );

    if (blocker) {
      throw new BlockedByAnotherSpeaker({
        last_name: blocker.last_name,
        first_name: blocker.first_name,
      });
    }

    const blockedStreamSpeaker = speakers.find((speaker) =>
      blockedIds.includes(speaker.id),
    );

    if (blockedStreamSpeaker) {
      throw new StreamHasBlockedSpeakerError({
        last_name: blockedStreamSpeaker.last_name,
        first_name: blockedStreamSpeaker.first_name,
      });
    }
  }
}
