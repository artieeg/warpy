import { BotInstanceStore } from 'lib';
import { TokenService } from '../token';
import { IUser } from '@warpy/lib';

export class BotInstanceService {
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
