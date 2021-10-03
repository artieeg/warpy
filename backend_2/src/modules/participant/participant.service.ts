import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse } from '@warpy/lib';
import { MediaService } from '../media/media.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';

type NewViewerParams = { user: string; stream: string; recvNodeId: string };

@Injectable()
export class ParticipantService {
  constructor(
    private eventEmitter: EventEmitter2,
    private media: MediaService,
    private streamBlocks: StreamBlockService,
    private participant: ParticipantEntity,
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
      this.media.getConsumerParams(permissions.recvNodeId, viewerId, stream),
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
}
