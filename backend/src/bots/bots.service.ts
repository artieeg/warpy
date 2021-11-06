import { DeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity';
import { MessageService } from '@backend_2/message/message.service';
import { TokenService } from '@backend_2/token/token.service';
import { Injectable } from '@nestjs/common';
import { BotConfirmResponseDTO } from './bots.dto';
import { BotsEntity } from './bots.entity';

@Injectable()
export class BotsService {
  constructor(
    private botEntity: BotsEntity,
    private developerAccountEntity: DeveloperAccountEntity,
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
