import { BotConfirmResponseDTO } from '@warpy-be/bots/bots.dto';
import { BotStore } from 'lib/stores';
import { DeveloperAccountStore } from 'lib/stores';
import { MessageService, TokenService } from '..';

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
    private botEntity: BotStore,
    private developerAccountEntity: DeveloperAccountStore,
    private messageService: MessageService,
    private tokenService: TokenService,
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
