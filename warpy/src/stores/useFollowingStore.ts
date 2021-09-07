import create, {SetState} from 'zustand';

interface IFollowingStore {
  following: string[];
  set: SetState<IFollowingStore>;
  add: (newFollowedUser: string) => void;
  remove: (unfollowedUser: string) => void;
  has: (user: string) => boolean;
}

export const useFollowingStore = create<IFollowingStore>((set, get) => ({
  following: [],
  set,
  add: newFollowedUser =>
    set(state => ({
      following: [...state.following, newFollowedUser],
    })),
  remove: unfollowedUser =>
    set(state => ({
      following: state.following.filter(id => id !== unfollowedUser),
    })),

  has: user => get().following.some(id => id === user),
}));
