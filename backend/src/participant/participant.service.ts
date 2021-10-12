import {
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@backend_2/errors';
import { StreamBlockEntity } from '@backend_2/stream-block/stream-block.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse, IParticipant } from '@warpy/lib';
import { BlockService } from '../block/block.service';
import { MediaService } from '../media/media.service';
import { MessageService } from '../message/message.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    private eventEmitter: EventEmitter2,
    private media: MediaService,
    private streamBlocks: StreamBlockService,
    private participant: ParticipantEntity,
    private blockService: BlockService,
    private messageService: MessageService,
    private streamBlockEntity: StreamBlockEntity,
  ) {}

  async createNewViewer(
    stream: string,
    viewerId: string,
  ): Promise<IJoinStreamResponse> {
    const { token, permissions } = await this.media.getViewerPermissions(
      viewerId,
      stream,
    );

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

    const media = await this.media.getSpeakerParams({
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

  //TODO: do not fetch participant info from the db (#110)
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

    await this.media.removeUserFromNodes(userToKickData);
    await this.streamBlockEntity.create(stream, userToKick);

    this.eventEmitter.emit('participant.kicked', userToKickData);
  }
}
