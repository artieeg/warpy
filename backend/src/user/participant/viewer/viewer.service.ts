import { MediaService } from '@warpy-be/media/media.service';
import { UserService } from '@warpy-be/user/user.service';
import { EVENT_NEW_PARTICIPANT, EVENT_RAISE_HAND } from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantBanService } from '../ban/ban.service';
import { ParticipantStore } from '../store';
import { IParticipant } from '@warpy/lib';

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

    this.eventEmitter.emit(EVENT_RAISE_HAND, participant);
  }

  async getViewers(stream: string, page: number) {
    const viewers = await this.participant.getViewersPage(stream, page);

    return viewers;
  }

  /**
   * Checks if the user has been banned on the stream,
   * points viewer to a new recv node, returns recv params and token
   * */
  async reconnectOldViewer(user: string, stream: string) {
    await this.bans.checkUserBanned(user, stream);

    const { token: mediaPermissionsToken, recvMediaParams } =
      await this.media.getViewerParams(user, stream);

    return { mediaPermissionsToken, recvMediaParams };
  }

  async createNewViewer(
    stream: string,
    viewerId: string,
  ): Promise<{ mediaPermissionsToken: string; recvMediaParams: any }> {
    await this.bans.checkUserBanned(viewerId, stream);

    const { recvMediaParams, token } = await this.media.getViewerParams(
      viewerId,
      stream,
    );

    const user = await this.user.find(viewerId);
    const viewer: IParticipant = {
      ...user,
      stream,
      role: 'viewer',
      isBanned: false,
      isBot: false,
    };

    await this.participant.add(viewer);

    this.eventEmitter.emit(EVENT_NEW_PARTICIPANT, { participant: viewer });

    return { mediaPermissionsToken: token, recvMediaParams };
  }
}
