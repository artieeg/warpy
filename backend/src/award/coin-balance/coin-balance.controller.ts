import { OnNewUser } from '@warpy-be/interfaces';
import { EVENT_INVITE_ACCEPTED, EVENT_USER_CREATED } from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { IGetCoinBalanceRequest } from '@warpy/lib';
import { CoinBalanceService } from './coin-balance.service';

@Controller()
export class CoinBalanceController implements OnNewUser {
  constructor(private coinBalanceService: CoinBalanceService) {}

  @MessagePattern('user.get-coin-balance')
  async getCoinBalance({ user }: IGetCoinBalanceRequest) {
    const balance = await this.coinBalanceService.getCoinBalance(user);

    return { balance };
  }

  @OnEvent(EVENT_USER_CREATED)
  async onNewUser({ user }) {
    this.coinBalanceService.createBalance(user);
  }

  @OnEvent(EVENT_INVITE_ACCEPTED)
  async onInviteAccepted({ inviter, invited }) {
    this.coinBalanceService.processAcceptedInvite(inviter, invited);
  }
}
