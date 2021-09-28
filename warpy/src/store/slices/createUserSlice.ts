import {User} from '@app/models';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';

export interface IUserSlice {
  user: User | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
  loadUserData: (token: string) => Promise<void>;
}

export const createUserSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IUserSlice => ({
  user: null,
  isLoadingUser: true,
  exists: false,
  following: [],
  loadUserData: async token => {
    const {api} = get();

    set({
      isLoadingUser: true,
    });

    const {user, following} = await api.user.auth(token);

    if (!user || !following) {
      set({
        isLoadingUser: false,
        exists: false,
      });

      return;
    }

    set({
      user,
      following,
      isLoadingUser: false,
    });
  },
});
