import { MediaService } from '@backend_2/media/media.service';
import { StreamBlockService } from '@backend_2/stream-block/stream-block.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse } from '@warpy/lib';
import { ParticipantEntity } from '../common/participant.entity';

@Injectable()
export class ViewerService {
  constructor(
    private media: MediaService,
    private eventEmitter: EventEmitter2,
    private streamBlocks: StreamBlockService,
    private participant: ParticipantEntity,
  ) {}

  async setRaiseHand(user: string, flag: boolean) {
    const participant = await this.participant.setRaiseHand(user, flag);

    this.eventEmitter.emit('participant.raise-hand', participant);
  }

  async getViewers(stream: string, page: number) {
    const viewers = await this.participant.getViewersPage(stream, page);

    return viewers;
  }

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
}
