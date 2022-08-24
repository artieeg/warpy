import { NoDeveloperAccount } from '@warpy-be/errors';
import { getMockedInstance } from '@warpy-be/utils';
import { when } from 'jest-when';
import { MessageService } from '../message';
import { TokenService } from '../token';
import { BotsService } from './bot.service';
import { BotStore } from './bot.store';
import { DeveloperAccountStore } from './developer-account.store';

describe('BotService', () => {
  const userWithoutDevAccount = 'nodevaccount_user';
  const dev = 'bot_dev_user';
  const devAccountId = 'dev_acc_id';

  const botStore = getMockedInstance<BotStore>(BotStore);
  const developerAccountStore = getMockedInstance<DeveloperAccountStore>(
    DeveloperAccountStore,
  );
  const messageService = getMockedInstance<MessageService>(MessageService);
  const tokenService = getMockedInstance<TokenService>(TokenService);

  messageService.request.mockResolvedValue({
    confirmation: {
      confirmed: true,
    },
  });

  const service = new BotsService(
    botStore as any,
    developerAccountStore as any,
    messageService as any,
    tokenService as any,
  );

  when(developerAccountStore.getDeveloperAccount)
    .calledWith(userWithoutDevAccount)
    .mockResolvedValue(null);

  when(developerAccountStore.getDeveloperAccount)
    .calledWith(dev)
    .mockResolvedValue(devAccountId);

  it('throws if user doenst have a developer account', async () => {
    expect(
      service.createNewBot('test', 'test', userWithoutDevAccount, 'test'),
    ).rejects.toThrowError(NoDeveloperAccount);
  });

  it('requests confirmation on the frontend', async () => {
    await service.createNewBot('test', 'test', dev, 'test');

    expect(messageService.request).toBeCalledWith(dev, expect.anything());
  });

  it('saves a bot record', async () => {
    await service.createNewBot('test', 'test', dev, 'test');

    expect(botStore.create).toBeCalledWith(
      'test',
      'test',
      'test',
      devAccountId,
    );
  });
});
