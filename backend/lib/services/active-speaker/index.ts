import { EVENT_ACTIVE_SPEAKERS } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface IActiveSpeakerService {
  broadcastActiveSpeakers(
    speakers: Record<string, { user: string; volume: number }[]>,
  ): Promise<void>;
}

export class ActiveSpeakerService implements IActiveSpeakerService {
  constructor(private events: EventEmitter2) {}

  async broadcastActiveSpeakers(
    speakers: Record<string, { user: string; volume: number }[]>,
  ) {
    for (const stream in speakers) {
      this.events.emit(EVENT_ACTIVE_SPEAKERS, {
        stream,
        activeSpeakers: speakers[stream],
      });
    }
  }
}
