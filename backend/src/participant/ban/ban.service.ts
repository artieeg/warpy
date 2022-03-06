import {
  UserNotFound,
  NoPermissionError,
  BannedFromStreamError,
} from '@backend_2/errors';
import { MediaService } from '@backend_2/media/media.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantEntity } from '../common/participant.entity';
import { StreamBanEntity } from './ban.entity';

@Injectable()
export class ParticipantBanService {
  constructor(
    private banEntity: StreamBanEntity,
    private participant: ParticipantEntity,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkUserBanned(user: string, stream: string) {
    const ban = await this.banEntity.find(user, stream);

    if (ban) {
      throw new BannedFromStreamError();
    }
  }

  async kickUser(userToKick: string, moderatorId: string) {
    const moderator = await this.participant.getById(moderatorId);

    if (!moderator) {
      throw new UserNotFound();
    }

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    const userToKickData = await this.participant.getById(userToKick);

    if (!userToKickData) {
      throw new UserNotFound();
    }

    const stream = moderator.stream;

    if (userToKickData.stream !== stream) {
      throw new NoPermissionError();
    }

    try {
      await this.media.removeUserFromNodes(userToKickData);
      await this.banEntity.create(stream, userToKick);
    } catch (e) {}

    this.eventEmitter.emit('participant.kicked', userToKickData);
  }
}
