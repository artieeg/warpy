import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ACTIVE_SPEAKERS, getMockedInstance } from '@warpy-be/utils';
import { ActiveSpeakerService } from './active-speaker.service';

describe('ActiveSpeakerService', () => {
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const service = new ActiveSpeakerService(events as any);

  it('emits active speakers', async () => {
    const data = {
      stream0: [{ user: 'user0', volume: 10 }],
      stream1: [{ user: 'user1', volume: 20 }],
    };

    await service.broadcastActiveSpeakers(data);

    for (const sid in data) {
      expect(events.emit).toBeCalledWith(EVENT_ACTIVE_SPEAKERS, {
        stream: sid,
        activeSpeakers: data[sid],
      });
    }
  });
});
