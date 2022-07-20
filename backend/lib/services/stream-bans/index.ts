import {
  UserNotFound,
  NoPermissionError,
  BannedFromStreamError,
} from '@warpy-be/errors';
import { EVENT_PARTICIPANT_KICKED } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantStore, StreamBanStore } from 'lib';

export interface IStreamBanService {
  checkUserBanned(user: string, stream: string): Promise<void>;
  banUser(userToKick: string, moderatorId: string): Promise<void>;
}

export class StreamBanService implements IStreamBanService {
  constructor(
    private banEntity: StreamBanStore,
    private participant: ParticipantStore,
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
      await this.banEntity.create(stream, userToKick);
    } catch (e) {}

    this.eventEmitter.emit(EVENT_PARTICIPANT_KICKED, userToKickData);
  }
}
