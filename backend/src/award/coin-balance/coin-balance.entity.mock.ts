import { getMockedInstance } from '@warpy-be/utils';
import { CoinBalanceEntity } from './coin-balance.entity';

export const mockedCoinBalanceEntity =
  getMockedInstance<CoinBalanceEntity>(CoinBalanceEntity);
