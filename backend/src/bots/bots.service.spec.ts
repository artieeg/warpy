import { DeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity';
import { mockedDeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity.mock';
import { mockedMediaService } from '@backend_2/media/media.service.mock';
import { MessageService } from '@backend_2/message/message.service';
import { mockedMessageService } from '@backend_2/message/message.service.mock';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
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
      .overrideProvider(MessageService)
      .useValue(mockedMessageService)
      .compile();
    botsService = m.get(BotsService);
  });

  describe('creating new bot', () => {
    const devAccountId = 'dev_user0';
    const user = 'user0';
    const bot = 'bot_id0';

    beforeAll(() => {
      mockedDeveloperAccountEntity.getDeveloperAccount.mockResolvedValue(
        devAccountId,
      );

      mockedMessageService.request.mockResolvedValue({
        user,
        bot,
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

    it.todo('checks if user is a developer');

    it.todo('returns bot secret token');

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
