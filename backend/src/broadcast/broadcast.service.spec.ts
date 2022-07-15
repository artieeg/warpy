import { NjsMessageService } from '@warpy-be/message/message.service';
import { mockedMessageService } from '@warpy-be/message/message.service.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NjsBroadcastService } from './broadcast.service';

describe('BroadcastService', () => {
  let broadcast: NjsBroadcastService;

  const participants = ['1', '2', '3'];

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(NjsMessageService)
      .useValue(mockedMessageService)
      .compile();

    broadcast = m.get(NjsBroadcastService);

    mockedMessageService.encodeMessage.mockReturnValue(new Uint8Array(120));

    mockedParticipantEntity.getIdsByStream.mockResolvedValue(participants);
  });

  it('broadcasts kicked user', async () => {
    await broadcast.broadcastKickedParticipant(createParticipantFixture({}));

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts chat message', async () => {
    await broadcast.broadcastChatMessage({
      idsToBroadcast: participants,
      message: 'test',
    });

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts reactions', async () => {
    await broadcast.broadcastReactions({ stream: 'test', reactions: ['sth'] });

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts active speakers', async () => {
    await broadcast.broadcastActiveSpeakers({
      stream: 'test',
      activeSpeakers: ['sth'] as any,
    });

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts new speaker', async () => {
    await broadcast.broadcastRoleChange(createParticipantFixture({}));

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts hand raise', async () => {
    await broadcast.broadcastHandRaise(createParticipantFixture({}));

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts participant left', async () => {
    await broadcast.broadcastParticipantLeft({ stream: 'test', user: 'test' });

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts participant media toggle', async () => {
    await broadcast.broadcastMediaToggle({
      user: 'test',
      stream: 'test',
      videoEnabled: true,
    });

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });

  it('broadcasts participant join', async () => {
    await broadcast.broadcastNewParticipant(createParticipantFixture({}));

    participants.forEach((id) => {
      expect(mockedMessageService.send).toBeCalledWith(id, expect.anything());
    });
  });
});
