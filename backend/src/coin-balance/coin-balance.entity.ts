import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CoinBalance } from '@prisma/client';
import { ICoinBalance } from '@warpy/lib';

@Injectable()
export class CoinBalanceEntity {
  constructor(private prisma: PrismaService) {}

  static toCoinBalanceDTO(item: CoinBalance): ICoinBalance {
    return {
      balance: item.balance,
    };
  }

  async getBalance(user_id: string): Promise<number> {
    const { balance } = await this.prisma.coinBalance.findUnique({
      where: {
        user_id,
      },
      select: {
        balance: true,
      },
    });

    return balance;
  }

  async createCoinBalance(user_id: string, initialBalance: number) {
    return CoinBalanceEntity.toCoinBalanceDTO(
      await this.prisma.coinBalance.create({
        data: {
          user_id,
          balance: initialBalance,
        },
      }),
    );
  }
}
