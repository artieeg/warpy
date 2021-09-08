import {IUser} from '@app/models';
import {useUserStore} from '@app/stores';

export const useAppUser = (): IUser => {
  return useUserStore(state => {
    if (!state.user) {
      throw new Error('User is null');
    }

    return state.user;
  });
};
