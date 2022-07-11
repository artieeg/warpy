import {
  UserNotFound,
  NoPermissionError,
  BannedFromStreamError,
} from '@warpy-be/errors';
import { MediaService } from '@warpy-be/media/media.service';
import { EVENT_PARTICIPANT_KICKED } from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsParticipantStore } from '../store';
import { ParticipantBanEntity } from './ban.entity';

@Injectable()
export class ParticipantBanService {
  constructor(
    private banEntity: ParticipantBanEntity,
    private participant: NjsParticipantStore,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkUserBanned(user: string, stream: string) {
    const ban = await this.banEntity.find(user, stream);

    if (ban) {
      throw new BannedFromStreamError();
    }
  }

  async banUser(userToKick: string, moderatorId: string) {
    const moderator = await this.participant.get(moderatorId);

    if (!moderator) {
      throw new UserNotFound();
    }

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    const userToKickData = await this.participant.get(userToKick);

    if (!userToKickData) {
      throw new UserNotFound();
    }

    const stream = moderator.stream;

    if (userToKickData.stream !== stream) {
      throw new NoPermissionError();
    }

    try {
      await this.media.removeFromNodes(userToKickData);
      await this.banEntity.create(stream, userToKick);
    } catch (e) {}

    this.eventEmitter.emit(EVENT_PARTICIPANT_KICKED, userToKickData);
  }
}
