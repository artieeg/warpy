import { IBotStore } from './bot.store';
import { IDeveloperAccountStore } from './developer-account.store';
import { IMessageService } from '../message';
import { ITokenService } from '../token';

export type BotConfirmResponseDTO = {
  user: string;
  bot: string;
  confirmed: boolean;
};

export interface IBotsService {
  createNewBot(
    name: string,
    botname: string,
    creatorUserId: string,
    avatar: string,
  ): Promise<{
    id: string;
    confimed: boolean;
    token: string;
  }>;
}

export class BotsService implements IBotsService {
  constructor(
    private botEntity: IBotStore,
    private developerAccountEntity: IDeveloperAccountStore,
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
