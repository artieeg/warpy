import { BotInstanceStore } from '@warpy-be/app';
import { TokenService } from '../token';
import { User } from '@warpy/lib';

export class BotInstanceService {
  constructor(
    private tokenService: TokenService,
    private botInstanceEntity: BotInstanceStore,
  ) {}

  async createBotInstance(bot: string, invitationToken: string): Promise<User> {
    const { stream } = this.tokenService.decodeToken(invitationToken);
    return this.botInstanceEntity.create(bot, stream);
  }
}
