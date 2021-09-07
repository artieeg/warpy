import {User} from '@app/models';
import create, {SetState} from 'zustand';
import {useAPIStore} from './useAPIStore';

interface IUserStore {
  user: User | null;
  loading: boolean;
  exists: boolean;
  following: string[];
  loadUserData: (token: string) => Promise<void>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
  user: null,
  loading: true,
  exists: false,
  following: [],
  loadUserData: async token => {
    const {api} = useAPIStore.getState();

    set({
      loading: true,
    });

    const {user, following} = await api.user.auth(token);

    if (!user || !following) {
      set({
        loading: false,
        exists: false,
      });
    }

    set({
      user,
      following,
      loading: false,
    });
  },
}));
