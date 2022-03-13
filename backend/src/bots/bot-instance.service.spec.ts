import { mockedEventEmitter } from '@warpy-be/events/events.service.mock';
import { MediaService } from '@warpy-be/media/media.service';
import { mockedMediaService } from '@warpy-be/media/media.service.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { TokenService } from '@warpy-be/token/token.service';
import { mockedTokenService } from '@warpy-be/token/token.service.mock';
import { EVENT_NEW_PARTICIPANT } from '@warpy-be/utils';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BotInstanceEntity } from './bot-instance.entity';
import { mockedBotInstanceEntity } from './bot-instance.entity.mock';
import { BotInstanceService } from './bot-instance.service';

describe('Bot Instance Service', () => {
  let botInstanceService: BotInstanceService;

  const bot = 'bot0';
  const stream = 'stream';

  const botInstanceId = 'bot0_instance';

  const sendNodeId = 'node0';
  const recvNodeId = 'node1';

  const botParticipant = createParticipantFixture({
    id: bot,
  });

  const mockedMediaPermissionToken = 'token0';
  const mockedSendMedia = { data: 'test' };
  const mockedRecvMedia = { data: 'test' };

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(MediaService)
      .useValue(mockedMediaService)
      .overrideProvider(TokenService)
      .useValue(mockedTokenService)
      .overrideProvider(BotInstanceEntity)
      .useValue(mockedBotInstanceEntity)
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)

      .overrideProvider(MediaService)
      .useValue(mockedMediaService)
      .compile();

    botInstanceService = m.get(BotInstanceService);

    mockedBotInstanceEntity.create.mockResolvedValue(botInstanceId);
    mockedParticipantEntity.create.mockResolvedValue(botParticipant);
    mockedMediaService.createPermissionToken.mockReturnValue(
      mockedMediaPermissionToken,
    );
    mockedMediaService.getSendRecvNodeIds.mockResolvedValue({
      sendNodeId,
      recvNodeId,
    });

    mockedTokenService.decodeToken.mockReturnValue({
      stream,
    });

    mockedMediaService.createSendTransport.mockResolvedValue(mockedSendMedia);
    mockedMediaService.getViewerParams.mockResolvedValue(mockedRecvMedia);
  });

  describe('joining a stream', () => {
    it('creates media token with audio & video streaming permissions', async () => {
      await botInstanceService.createBotInstance(bot, 'test');

      expect(mockedMediaService.createPermissionToken).toBeCalledWith(
        expect.objectContaining({
          room: stream,
          user: bot,
          audio: true,
          video: true,
          sendNodeId,
          recvNodeId,
        }),
      );
    });

    it('creates a bot instance', async () => {
      await botInstanceService.createBotInstance(bot, 'test');

      expect(mockedBotInstanceEntity.create).toBeCalledWith(bot);
    });

    it('creates a bot participant', async () => {
      await botInstanceService.createBotInstance(bot, 'test');

      expect(mockedParticipantEntity.create).toBeCalledWith({
        bot_id: botInstanceId,
        stream,
        recvNodeId,
        sendNodeId,
        audioEnabled: false,
        videoEnabled: false,
        role: 'streamer',
      });
    });

    it('broadcasts the bot participant', async () => {
      await botInstanceService.createBotInstance(bot, 'test');

      expect(mockedEventEmitter.emit).toBeCalledWith(EVENT_NEW_PARTICIPANT, {
        participant: botParticipant,
      });
    });

    it('connects bot to the send media node', async () => {
      expect(
        botInstanceService.createBotInstance(bot, 'test'),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          sendMedia: mockedSendMedia,
        }),
      );
    });

    it('connects bot to the recv media node', async () => {
      expect(
        botInstanceService.createBotInstance(bot, 'test'),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          recvMedia: mockedRecvMedia,
        }),
      );
    });

    it('sends media permissions token', async () => {
      expect(
        botInstanceService.createBotInstance(bot, 'test'),
      ).resolves.toStrictEqual(
        expect.objectContaining({
          mediaPermissionToken: mockedMediaPermissionToken,
        }),
      );
    });
  });
});
