import {IUser} from '@app/models';
import {useStore} from '@app/store';

export const useAppUser = (): IUser => {
  return useStore(state => {
    if (!state.user) {
      throw new Error('User is null');
    }

    return state.user;
  });
};
