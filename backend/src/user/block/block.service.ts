import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { ParticipantEntity } from '@backend_2/participant/common/participant.entity';
import { BlockEntity } from './block.entity';

@Injectable()
export class BlockService {
  constructor(
    private participantEntity: ParticipantEntity,
    private blockEntity: BlockEntity,
  ) {}

  async unblockUser(blocker: string, blocked: string) {
    await this.blockEntity.deleteByUsers(blocker, blocked);
  }

  async blockUser(blocker: string, blocked: string) {
    const blockId = await this.blockEntity.create({
      blocker,
      blocked,
    });

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
