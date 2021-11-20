import {useQuery} from 'react-query';
import {APIClient} from '@warpy/api';

export const useCoinBalance = (api: APIClient) =>
  useQuery('coin-balance', api.coin_balance.get, {
    notifyOnChangeProps: ['data'],
  });
