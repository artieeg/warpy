import { BotStore } from './bot.store';
import { DeveloperAccountStore } from './developer-account.store';
import { IMessageService } from '../message';
import { ITokenService } from '../token';

export type BotConfirmResponseDTO = {
  user: string;
  bot: string;
  confirmed: boolean;
};

export class BotsService {
  constructor(
    private botEntity: BotStore,
    private developerAccountEntity: DeveloperAccountStore,
    private messageService: IMessageService,
    private tokenService: ITokenService,
  ) {}

  async createNewBot(
    name: string,
    botname: string,
    creatorUserId: string,
    avatar: string,
  ) {
    const devAccountId = await this.developerAccountEntity.getDeveloperAccount(
      creatorUserId,
    );

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

    const id = await this.botEntity.create(name, botname, avatar, devAccountId);
    const token = this.tokenService.createAuthToken(id, true);

    return { id, confimed: confirmation.confirmed, token };
  }
}
