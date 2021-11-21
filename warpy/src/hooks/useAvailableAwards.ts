import {useQuery} from 'react-query';
import {APIClient} from '../../../api_client';

export const useAvailableAwards = (api: APIClient) =>
  useQuery('award-models', api.awards.getAvailable, {
    notifyOnChangeProps: ['data'],
  });
