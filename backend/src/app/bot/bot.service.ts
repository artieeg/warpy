import { BotStore } from './bot.store';
import { DeveloperAccountStore } from './developer-account.store';
import { TokenService } from '@warpy-be/app/token';
import { MessageService } from '@warpy-be/app/message';

export type BotConfirmResponseDTO = {
  user: string;
  bot: string;
  confirmed: boolean;
};

export class BotsService {
  constructor(
    private botStore: BotStore,
    private developerAccountStore: DeveloperAccountStore,
    private messageService: MessageService,
    private tokenService: TokenService,
  ) {}

  async createNewBot(
    name: string,
    botname: string,
    creatorUserId: string,
    avatar: string,
  ) {
    //Checks if the user has a developer account
    const devAccountId = await this.developerAccountStore.getDeveloperAccount(
      creatorUserId,
    );

    if (!devAccountId) {
      return;
    }

    //Request detail confirmation from the front end
    const confirmation =
      await this.messageService.request<BotConfirmResponseDTO>(creatorUserId, {
        request: 'create-bot-confirmation',
        data: {
          bot: {
            botname,
            avatar,
            name,
          },
        },
      });

    const id = await this.botStore.create(name, botname, avatar, devAccountId);

    //Identification token for bot dev
    const token = this.tokenService.createAuthToken(id, true);

    return { id, confimed: confirmation.confirmed, token };
  }
}
