import { EVENT_ACTIVE_SPEAKERS } from '@backend_2/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ActiveSpeakerService {
  constructor(private eventEmitter: EventEmitter2) {}

  async broadcastActiveSpeakers(
    speakers: Record<string, { user: string; volume: number }[]>,
  ) {
    for (const stream in speakers) {
      this.eventEmitter.emit(EVENT_ACTIVE_SPEAKERS, {
        stream,
        activeSpeakers: speakers[stream],
      });
    }
  }
}
