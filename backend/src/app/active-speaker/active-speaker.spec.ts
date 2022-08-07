import { getMockedInstance } from '@warpy-be/utils';
import { BroadcastService } from '../broadcast';
import { ParticipantStore } from '../participant';
import { ActiveSpeakerService } from './active-speaker.service';

describe('ActiveSpeakerService', () => {
  const participantStore =
    getMockedInstance<ParticipantStore>(ParticipantStore);
  const broadcastService =
    getMockedInstance<BroadcastService>(BroadcastService);
  const service = new ActiveSpeakerService(
    broadcastService as any,
    participantStore as any,
  );

  const ids = ['user0', 'user1'];
  participantStore.getParticipantIds.mockResolvedValue(ids);

  it('emits active speakers', async () => {
    const data = {
      stream0: [{ user: 'user0', volume: 10 }],
      stream1: [{ user: 'user1', volume: 20 }],
    };

    await service.broadcastActiveSpeakers(data);

    for (const sid in data) {
      expect(broadcastService.broadcast).toBeCalledWith(ids, {
        event: 'active-speaker',
        data: {
          stream: sid,
          speakers: data[sid],
        },
      });
    }
  });
});
