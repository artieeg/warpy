import { DeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity';
import { mockedDeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity.mock';
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
      .compile();
    botsService = m.get(BotsService);
  });

  describe('creating new bot', () => {
    it.todo('asks the creator to confirm');

    it.todo('checks if the avatar is a Giphy/Tenor gif');

    it.todo('checks if botname ends with "bot"');

    it.todo('checks if user is a developer');

    it('creates a new bot in the db', async () => {
      const devAccountId = 'dev_user0';
      mockedDeveloperAccountEntity.getDeveloperAccount.mockResolvedValueOnce(
        devAccountId,
      );

      await botsService.createNewBot('Bot Name', 'test_bot', 'user0', 'test');

      expect(mockedBotsEntity.create).toBeCalledWith(
        'Bot Name',
        'test_bot',
        'test',
        devAccountId,
      );
    });

    it.todo('returns bot secret token');

    /*
    await botsService.createNewBot(
      'Bot Name',
      'bot0',
      'user0',
      'giphy.com/avatar.gif',
    );
    */
  });
});
