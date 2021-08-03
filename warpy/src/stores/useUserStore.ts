import {User} from '@app/models';
import create, {SetState} from 'zustand';

interface IUserStore {
  user: User | null;
  set: SetState<IUserStore>;
}

export const useUserStore = create<IUserStore>(set => ({
  user: null,
  set,
}));
