import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoPermissionError } from '@warpy-be/errors';
import { EVENT_PARTICIPANT_KICKED } from '@warpy-be/utils';
import { BroadcastService } from '../broadcast';
import { ParticipantService } from '../participant/participant.service';
import { ParticipantStore } from '../participant/participant.store';
import { StreamBanStore } from './stream-bans.store';

export class ParticipantKickerService {
  constructor(
    private participantService: ParticipantService,
    private participantStore: ParticipantStore,
    private streamBanStore: StreamBanStore,
    private events: EventEmitter2,
    private broadcastService: BroadcastService,
  ) {}

  async isUserKicked(user: string, stream: string) {
    const ban = await this.streamBanStore.find(user, stream);

    return !!ban;
  }

  async kickStreamParticipant(userToKick: string, moderatorId: string) {
    const moderator = await this.participantService.get(moderatorId);

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    const userToKickData = await this.participantService.get(userToKick);

    const stream = moderator.stream;

    if (userToKickData.stream !== stream) {
      throw new NoPermissionError();
    }

    const [idsOnStream] = await Promise.all([
      this.participantStore.getParticipantIds(stream),
      this.streamBanStore.create(stream, userToKick),
    ]);

    this.broadcastService.broadcast(idsOnStream, {
      event: 'user-kicked',
      data: {
        user: userToKick,
        stream,
      },
    });

    this.events.emit(EVENT_PARTICIPANT_KICKED, userToKickData);
  }
}
