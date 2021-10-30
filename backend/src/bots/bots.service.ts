import { DeveloperAccountEntity } from '@backend_2/developer_account/developer_account.entity';
import { Injectable } from '@nestjs/common';
import { BotsEntity } from './bots.entity';

@Injectable()
export class BotsService {
  constructor(
    private botEntity: BotsEntity,
    private developerAccountEntity: DeveloperAccountEntity,
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

    await this.botEntity.create(name, botname, avatar, devAccountId);
  }
}
