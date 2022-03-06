import { BotInstanceEntity } from '@backend_2/bots/bot-instance.entity';
import {
  MaxVideoStreamers,
  NoPermissionError,
  UserNotFound,
} from '@backend_2/errors';
import { StreamBlockEntity } from '@backend_2/stream-block/stream-block.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse, Roles } from '@warpy/lib';
import { BlockService } from '../block/block.service';
import { MediaService } from '../media/media.service';
import { MessageService } from '../message/message.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './common/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    private botInstanceEntity: BotInstanceEntity,
    private eventEmitter: EventEmitter2,
    private media: MediaService,
    private streamBlocks: StreamBlockService,
    private participant: ParticipantEntity,
    private blockService: BlockService,
    private messageService: MessageService,
    private streamBlockEntity: StreamBlockEntity,
  ) {}

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

  async getViewers(stream: string, page: number) {
    const viewers = await this.participant.getViewersPage(stream, page);

    return viewers;
  }

  async setRaiseHand(user: string, flag: boolean) {
    const participant = await this.participant.setRaiseHand(user, flag);

    this.eventEmitter.emit('participant.raise-hand', participant);
  }

  async broadcastActiveSpeakers(
    speakers: Record<string, { user: string; volume: number }[]>,
  ) {
    for (const stream in speakers) {
      this.eventEmitter.emit('participant.active-speakers', {
        stream,
        activeSpeakers: speakers[stream],
      });
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
      await this.streamBlockEntity.create(stream, userToKick);
    } catch (e) {}

    this.eventEmitter.emit('participant.kicked', userToKickData);
  }

  async setRole(mod: string, userToUpdate: string, role: Roles) {
    const moderator = await this.participant.getById(mod);
    const { stream } = moderator;

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    if (role !== 'viewer') {
      await this.blockService.isBannedBySpeaker(userToUpdate, stream);
    }

    const oldUserData = await this.participant.getById(userToUpdate);

    //receive new media token,
    //sendNodeId and send transport data (if upgrading from viewer)
    const { sendNodeId, ...rest } = await this.media.updateRole(
      oldUserData,
      role,
    );

    let response = {
      role,
      rest,
    };

    //Update participant record with a new role
    //and a new send node id (if changed)
    const updatedUser = await this.participant.updateOne(userToUpdate, {
      sendNodeId,
      role,

      //mark video as disabled if role set to speaker or viewer
      videoEnabled: !(role === 'speaker' || role === 'viewer')
        ? false
        : undefined,

      //mark audio as disabled if role set to viewer
      audioEnabled: !(role === 'viewer'),
    });

    this.messageService.sendMessage(userToUpdate, {
      event: 'role-change',
      data: response,
    });

    this.eventEmitter.emit('participant.role-change', updatedUser);
  }

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
}
