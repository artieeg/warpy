import {UserBase} from '@warpy/lib';
import {useStore} from '@app/store';

export const useAppUser = (): UserBase => {
  const user = useStore(store => store.user);
  if (!user) {
    throw new Error('User is null');
  }

  return user;
};
