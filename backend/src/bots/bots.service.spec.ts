import { DeveloperAccountEntity } from '@warpy-be/developer_account/developer_account.entity';
import { mockedDeveloperAccountEntity } from '@warpy-be/developer_account/developer_account.entity.mock';
import { NotADeveloper } from '@warpy-be/errors';
import { mockedMediaService } from '@warpy-be/media/media.service.mock';
import { NjsMessageService } from '@warpy-be/message/message.service';
import { mockedMessageService } from '@warpy-be/message/message.service.mock';
import { NJTokenService } from '@warpy-be/token/token.service';
import { mockedTokenService } from '@warpy-be/token/token.service.mock';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { BotsEntity } from './bots.entity';
import { mockedBotsEntity } from './bots.entity.mock';
import { BotsService } from './bots.service';

describe('BotsService', () => {
  let botsService: BotsService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(BotsEntity)
      .useValue(mockedBotsEntity)
      .overrideProvider(DeveloperAccountEntity)
      .useValue(mockedDeveloperAccountEntity)
      .overrideProvider(NjsMessageService)
      .useValue(mockedMessageService)
      .overrideProvider(NJTokenService)
      .useValue(mockedTokenService)
      .compile();
    botsService = m.get(BotsService);
  });

  describe('creating new bot', () => {
    const devAccountId = 'dev_user0';
    const user = 'user0';
    const bot = 'bot_id0';
    const token = 'test-token';

    beforeAll(() => {
      mockedBotsEntity.create.mockResolvedValue(bot);

      mockedTokenService.createToken.mockReturnValue(token);

      mockedDeveloperAccountEntity.getDeveloperAccount.mockResolvedValue(
        devAccountId,
      );

      mockedMessageService.request.mockResolvedValue({
        confirmed: true,
      });
    });

    it('asks the creator to confirm', async () => {
      const bot = {
        botname: 'bot0',
        avatar: 'test',
        name: 'Bot',
      };

      const request = {
        request: 'create-bot-confirmation',
        data: {
          bot,
        },
      };

      await botsService.createNewBot(bot.name, bot.botname, user, bot.avatar);

      expect(mockedMessageService.request).toBeCalledWith(user, request);
    });

    it.todo('checks if the avatar is a Giphy/Tenor gif');

    it.todo('checks if botname ends with "bot"');

    it('checks if user is a developer', async () => {
      mockedDeveloperAccountEntity.getDeveloperAccount.mockRejectedValueOnce(
        new NotADeveloper(),
      );

      expect(
        botsService.createNewBot('Bot Name', 'test_bot', user, 'test'),
      ).rejects.toThrowError(NotADeveloper);
    });

    it('returns bot token, id, confirmation result', () => {
      expect(
        botsService.createNewBot('Bot Name', 'test_bot', user, 'test'),
      ).resolves.toStrictEqual({
        id: bot,
        confimed: true,
        token,
      });
    });

    it('creates a new bot in the db', async () => {
      await botsService.createNewBot('Bot Name', 'test_bot', user, 'test');

      expect(mockedBotsEntity.create).toBeCalledWith(
        'Bot Name',
        'test_bot',
        'test',
        devAccountId,
      );
    });
  });
});
