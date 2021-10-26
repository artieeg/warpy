import { MessageService } from '@backend_2/message/message.service';
import { mockedMessageService } from '@backend_2/message/message.service.mock';
import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { mockedParticipantEntity } from '@backend_2/participant/participant.entity.mock';
import { createParticipantFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { BroadcastService } from './broadcast.service';

describe('BroadcastService', () => {
  let broadcast: BroadcastService;

  const participants = ['1', '2', '3'];

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(MessageService)
      .useValue(mockedMessageService)
      .compile();

    broadcast = m.get(BroadcastService);

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
