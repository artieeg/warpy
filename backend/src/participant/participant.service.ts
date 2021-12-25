import { BotInstanceEntity } from '@backend_2/bots/bot-instance.entity';
import {
  MaxVideoStreamers,
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@backend_2/errors';
import { StreamBlockEntity } from '@backend_2/stream-block/stream-block.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse, IRoleUpdateEvent, Roles } from '@warpy/lib';
import { BlockService } from '../block/block.service';
import { MediaService } from '../media/media.service';
import { MessageService } from '../message/message.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';

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

  async createNewViewer(
    stream: string,
    viewerId: string,
  ): Promise<IJoinStreamResponse> {
    const { token, permissions } = await this.media.getViewerPermissions(
      viewerId,
      stream,
    );

    console.log('viewer id', viewerId, stream);

    await this.streamBlocks.checkUserBanned(viewerId, stream);

    const viewer = await this.participant.create({
      user_id: viewerId,
      stream,
      role: 'viewer',
      recvNodeId: permissions.recvNodeId,
    });

    this.eventEmitter.emit('participant.new', viewer);

    const [recvMediaParams, speakers, raisedHands, count] = await Promise.all([
      this.media.getViewerParams(permissions.recvNodeId, viewerId, stream),
      this.participant.getSpeakers(stream),
      this.participant.getWithRaisedHands(stream),
      this.participant.count(stream),
    ]);

    return {
      speakers: speakers,
      raisedHands: raisedHands,
      count,
      mediaPermissionsToken: token,
      recvMediaParams,
    };
  }

  async getStreamParticipants(stream: string) {
    return this.participant.getIdsByStream(stream);
  }

  async deleteBotParticipant(bot: string) {
    const instances = await this.botInstanceEntity.getBotInstances(bot);

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

  async allowSpeaker(hostId: string, newSpeakerId: string) {
    const { stream, role } = await this.participant.getById(hostId);

    if (!stream) {
      throw new StreamNotFound();
    }

    if (role !== 'streamer') {
      throw new NoPermissionError();
    }

    await this.blockService.isBannedBySpeaker(newSpeakerId, stream);

    const speakerData = await this.participant.makeSpeaker(newSpeakerId);

    if (!speakerData) {
      throw new UserNotFound();
    }

    const media = await this.media.createSendTransport({
      speaker: newSpeakerId,
      roomId: stream,
    });

    const { recvNodeId } = speakerData;
    const sendNodeId = await this.media.getSendNodeId();

    await this.participant.updateOne(newSpeakerId, { sendNodeId });

    const { token } = await this.media.getSpeakerPermissions(
      newSpeakerId,
      stream,
      {
        recvNodeId,
        sendNodeId,
      },
    );

    this.messageService.sendMessage(newSpeakerId, {
      event: 'speaking-allowed',
      data: {
        stream,
        media,
        mediaPermissionToken: token,
      },
    });

    this.eventEmitter.emit('participant.new-speaker', speakerData);
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

    let sendNodeId = oldUserData.sendNodeId;
    let recvNodeId = oldUserData.recvNodeId;

    let response = {
      role,
    };

    if (oldUserData.role === 'viewer') {
      //If the user was viewer, he hasn't been assigned to a media send node
      sendNodeId = await this.media.getSendNodeId();

      response['media'] = await this.media.createSendTransport({
        roomId: stream,
        speaker: userToUpdate,
      });
    }

    const updatedUser = await this.participant.updateOne(userToUpdate, {
      sendNodeId,
      role,
    });

    response['mediaPermissionToken'] = this.media.createPermissionToken({
      audio: role !== 'viewer',
      video: role === 'streamer',
      sendNodeId,
      recvNodeId,
      user: userToUpdate,
      room: stream,
    });

    this.messageService.sendMessage(userToUpdate, {
      event: 'role-change',
      data: response,
    });

    this.eventEmitter.emit('participant.role-change', updatedUser);
  }

  /** expendable & ugly, TODO: rewrite during #130*/
  async returnToViewer(user: string) {
    const { recvNodeId } = await this.participant.getById(user);

    const data = await this.participant.updateOne(user, {
      role: 'viewer',
      sendNodeId: null,
      audioEnabled: false,
      videoEnabled: false,
      isRaisingHand: false,
    });

    let response: IRoleUpdateEvent = {
      role: 'viewer',
    } as any;

    response['mediaPermissionToken'] = this.media.createPermissionToken({
      audio: false,
      video: false,
      sendNodeId: null,
      recvNodeId,
      user: user,
      room: data.stream,
    });

    this.messageService.sendMessage(user, {
      event: 'role-change',
      data: response,
    });
    console.log('updated role', data);

    this.eventEmitter.emit('participant.role-change', data);
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
