import {IUser} from '@app/models';
import {useUserStore} from '@app/stores';

export const useAppUser = (): IUser | null => {
  return useUserStore(state => state.user);
};
