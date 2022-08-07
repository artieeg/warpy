import { BroadcastService } from '../broadcast';
import { ParticipantStore } from '../participant';

export class ActiveSpeakerService {
  constructor(
    private broadcastService: BroadcastService,
    private participantStore: ParticipantStore,
  ) {}

  async broadcastActiveSpeakers(
    speakers: Record<string, { user: string; volume: number }[]>,
  ) {
    for (const stream in speakers) {
      const ids = await this.participantStore.getParticipantIds(stream);

      this.broadcastService.broadcast(ids, {
        event: 'active-speaker',
        data: {
          stream,
          speakers: speakers[stream],
        },
      });
    }
  }
}
