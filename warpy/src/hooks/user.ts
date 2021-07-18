import {IUser} from '@app/models';
import {useAppSelector} from '@app/store';

export const useAppUser = (): [IUser | null, Error | undefined] => {
  return useAppSelector(state => {
    return [state.user.data || null, state.user.error || null];
  });
};
