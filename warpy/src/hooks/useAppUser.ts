import {IUser} from '@app/models';
import {useUserStore} from '@app/stores';

export const useNullableAppUser = (): IUser | null => {
  return useUserStore(state => state.user);
};

export const useAppUser = (): IUser => {
  return useUserStore(state => state.user as IUser);
};
