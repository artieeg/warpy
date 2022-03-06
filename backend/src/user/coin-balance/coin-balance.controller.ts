import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGetCoinBalanceRequest } from '@warpy/lib';
import { CoinBalanceService } from './coin-balance.service';

@Controller()
export class CoinBalanceController {
  constructor(private coinBalanceService: CoinBalanceService) {}

  @MessagePattern('user.get-coin-balance')
  async getCoinBalance({ user }: IGetCoinBalanceRequest) {
    const balance = await this.coinBalanceService.getCoinBalance(user);

    return { balance };
  }
}
