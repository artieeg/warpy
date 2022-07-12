import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NEW_PARTICIPANT } from '@warpy-be/utils';
import { IParticipant } from '@warpy/lib';
import { IParticipantStore } from 'lib/stores';
import { IMediaService } from '../media';
import { IStreamBanService } from '../stream-bans';
import { IUserService } from '../user';

export interface ParticipantCreator {
  createNewParticipant(
    stream: string,
    userId: string,
  ): Promise<{
    recvMediaParams: any;
    mediaPermissionsToken: string;
  }>;
}

export class ParticipantCreatorImpl {
  constructor(
    private participantStore: IParticipantStore,
    private user: IUserService,
    private bans: IStreamBanService,
    private events: EventEmitter2,
    private media: IMediaService,
  ) {}

  async createNewParticipant(stream: string, userId: string) {
    await this.bans.checkUserBanned(userId, stream);

    const { recvMediaParams, token } = await this.media.getViewerParams(
      userId,
      stream,
    );

    const user = await this.user.findById(userId);
    const viewer: IParticipant = {
      ...user,
      stream,
      role: 'viewer',
      isBanned: false,
      isBot: false,
    };

    await this.participantStore.add(viewer);

    this.events.emit(EVENT_NEW_PARTICIPANT, { participant: viewer });

    return { mediaPermissionsToken: token, recvMediaParams };
  }
}
