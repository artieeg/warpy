import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { BotsService } from './bots.service';

describe('BotsService', () => {
  let botsService: BotsService;

  beforeAll(async () => {
    const m = await testModuleBuilder.compile();
    botsService = m.get(BotsService);
  });

  describe('creating new bot', () => {
    it.todo('asks the creator to confirm');

    it.todo('checks if user is a developer');

    it.todo('creates a new bot in the db');

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
