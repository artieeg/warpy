import {IUser} from '@app/models';
import {useStore} from '@app/store';

export const useAppUser = (): IUser => {
  const user = useStore.use.user();

  if (!user) {
    throw new Error('User is null');
  }

  return user;
};
