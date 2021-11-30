import {useQuery} from 'react-query';
import {IAppInviteResponse} from '@warpy/lib';
import {useStoreShallow} from '@warpy/store';

export const useAppInviteCode = () => {
  const [api, user] = useStoreShallow(state => [state.api, state.user!.id]);

  return useQuery<IAppInviteResponse>(
    'app-invite-code',
    async () => await api.app_invite.get(user),
    {
      notifyOnChangeProps: ['data'],
    },
  );
};
