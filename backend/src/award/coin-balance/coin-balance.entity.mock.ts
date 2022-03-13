import { getMockedInstance } from '@backend_2/utils';
import { CoinBalanceEntity } from './coin-balance.entity';

export const mockedCoinBalanceEntity =
  getMockedInstance<CoinBalanceEntity>(CoinBalanceEntity);
