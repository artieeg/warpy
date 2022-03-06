import { BotInstanceEntity } from '@backend_2/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@backend_2/errors';
import { MediaService } from '@backend_2/media/media.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantEntity } from './participant.entity';

@Injectable()
export class ParticipantCommonService {
  constructor(
    private participant: ParticipantEntity,
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
    const stream = await this.participant.getCurrentStreamFor(user);

    const update = {};

    if (audioEnabled !== undefined) {
      update['audioEnabled'] = audioEnabled;
    }

    if (videoEnabled !== undefined) {
      const activeVideoStreamers =
        await this.participant.countUsersWithVideoEnabled(stream);

      //If the user tries to send video when there are already 4 video streamers...
      if (activeVideoStreamers >= 4 && videoEnabled === true) {
        throw new MaxVideoStreamers();
      }

      update['videoEnabled'] = videoEnabled;
    }

    await this.participant.updateOne(user, update);

    this.eventEmitter.emit('participant.media-toggle', {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }

  async removeUserFromStream(user: string) {
    const userToRemove = await this.participant.getById(user);

    if (userToRemove) {
      await this.media.removeUserFromNodes(userToRemove);
    }

    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      await this.deleteBotParticipant(user);
    } else {
      await this.deleteParticipant(user);
    }
  }

  async getStreamParticipants(stream: string) {
    return this.participant.getIdsByStream(stream);
  }

  async deleteBotParticipant(bot: string) {
    const instances = await this.botInstanceEntity.getBotInstances(bot);

    //TODO: ???
    const promises = instances.map(async ({ botInstanceId, stream }) => {
      await this.participant.deleteParticipant(botInstanceId);
      this.eventEmitter.emit('participant.delete', {
        user: botInstanceId,
        stream,
      });
    });

    await Promise.all(promises);
  }

  async deleteParticipant(user: string) {
    const stream = await this.participant.getCurrentStreamFor(user);

    this.eventEmitter.emit('participant.delete', { user, stream });

    try {
      await this.participant.deleteParticipant(user);
    } catch (e) {}
  }
}
