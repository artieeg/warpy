import {
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@backend_2/errors';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse } from '@warpy/lib';
import { BlockService } from '../block/block.service';
import { BroadcastService } from '../broadcast/broadcast.service';
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
    const stream = await this.participant.getCurrentStreamFor(hostId);

    if (!stream) {
      throw new StreamNotFound();
    }

    const role = await this.participant.getRoleFor(hostId, stream);

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

    await this.participant.updateOne(newSpeakerId, { recvNodeId });

    const mediaPermissionToken = this.media.getSpeakerPermissions(
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
        mediaPermissionToken,
      },
    });

    this.eventEmitter.emit('participant.new-speaker', speakerData);
    //BroadcastService.broadcastNewSpeaker(speakerData);
  }
}
