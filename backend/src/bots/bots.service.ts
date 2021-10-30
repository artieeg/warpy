import { DeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity';
import { MessageService } from '@backend_2/message/message.service';
import { Injectable } from '@nestjs/common';
import { BotConfirmResponseDTO } from './bots.dto';
import { BotsEntity } from './bots.entity';

@Injectable()
export class BotsService {
  constructor(
    private botEntity: BotsEntity,
    private developerAccountEntity: DeveloperAccountEntity,
    private messageService: MessageService,
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

    await this.botEntity.create(name, botname, avatar, devAccountId);

    return { id: 'test', confimed: confirmation.confirmed };
  }
}
