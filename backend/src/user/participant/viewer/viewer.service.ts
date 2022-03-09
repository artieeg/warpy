import { MediaService } from '@backend_2/media/media.service';
import { UserService } from '@backend_2/user/user.service';
import { EVENT_NEW_PARTICIPANT, EVENT_STREAM_JOINED } from '@backend_2/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJoinStreamResponse } from '@warpy/lib';
import { ParticipantBanService } from '../ban/ban.service';
import { IFullParticipant, ParticipantStore } from '../store';

@Injectable()
export class ViewerService {
  constructor(
    private media: MediaService,
    private eventEmitter: EventEmitter2,
    private bans: ParticipantBanService,
    private participant: ParticipantStore,
    private user: UserService,
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
    const { token, recvNodeId } = await this.media.getViewerToken(
      viewerId,
      stream,
    );

    await this.bans.checkUserBanned(viewerId, stream);

    const user = await this.user.get(viewerId);
    const viewer: IFullParticipant = {
      ...user,
      stream,
      role: 'viewer',
      recvNodeId,
      sendNodeId: null,
      isBanned: false,
      isBot: false,
    };

    await this.participant.add(viewer);

    this.eventEmitter.emit(EVENT_NEW_PARTICIPANT, viewer);
    this.eventEmitter.emit(EVENT_STREAM_JOINED, { stream, user: viewer.id });

    const [recvMediaParams, speakers, raisedHands, count] = await Promise.all([
      this.media.getViewerParams(recvNodeId, viewerId, stream),
      this.participant.getStreamers(stream),
      this.participant.getRaisedHands(stream),
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
