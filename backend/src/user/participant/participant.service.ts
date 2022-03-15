import { BotInstanceEntity } from '@warpy-be/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@warpy-be/errors';
import { MediaService } from '@warpy-be/media/media.service';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantStore } from './store';

@Injectable()
export class ParticipantService {
  constructor(
    private participant: ParticipantStore,
    private botInstanceEntity: BotInstanceEntity,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participant.getStreamId(user);

    const update = {};

    if (audioEnabled !== undefined) {
      update['audioEnabled'] = audioEnabled;
    }

    if (videoEnabled !== undefined) {
      const activeVideoStreamers = await this.participant.countVideoStreamers(
        stream,
      );

      //If the user tries to send video when there are already 4 video streamers...
      if (activeVideoStreamers >= 4 && videoEnabled === true) {
        throw new MaxVideoStreamers();
      }

      update['videoEnabled'] = videoEnabled;
    }

    await this.participant.update(user, update);

    this.eventEmitter.emit('participant.media-toggle', {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }

  async activateUser(user: string) {
    const data = await this.participant.get(user);

    if (!data) {
      return;
    }

    await this.participant.setDeactivated(user, data.stream, false);
    this.eventEmitter.emit(EVENT_PARTICIPANT_REJOIN, { participant: data });
  }

  async deactivateUser(user: string) {
    const data = await this.participant.get(user);

    if (!data) {
      return;
    }

    //ignore bots
    if (user.slice(0, 3) === 'bot') {
      return this.removeUserFromStream(user, data.stream);
    }

    await this.participant.setDeactivated(user, data.stream, true);
    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, { participant: data });
  }

  async removeUserFromStream(user: string, stream?: string) {
    const userToRemove = await this.participant.get(user);

    if (userToRemove) {
      await this.media.removeFromNodes(userToRemove);
    }

    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      const instance = await this.botInstanceEntity.getBotInstante(
        user,
        stream,
      );

      await this.deleteUserParticipant(instance.id);
    } else {
      await this.deleteUserParticipant(user);
    }

    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: userToRemove.stream,
    });
  }

  private async deleteUserParticipant(user: string) {
    try {
      await this.participant.del(user);
    } catch (e) {
      console.error(e);
    }
  }

  async clearStreamData(stream: string) {
    return this.participant.clearStreamData(stream);
  }
}
