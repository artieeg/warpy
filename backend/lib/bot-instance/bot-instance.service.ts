import { BotInstanceStore } from 'lib';
import { TokenService } from '../token';
import { IUser } from '@warpy/lib';

export interface IBotInstanceService {
  createBotInstance(bot: string, invitationToken: string): Promise<IUser>;
}

export class BotInstanceService implements IBotInstanceService {
  constructor(
    private tokenService: TokenService,
    private botInstanceEntity: BotInstanceStore,
  ) {}

  async createBotInstance(
    bot: string,
    invitationToken: string,
  ): Promise<IUser> {
    const { stream } = this.tokenService.decodeToken(invitationToken);
    return this.botInstanceEntity.create(bot, stream);
  }
}
