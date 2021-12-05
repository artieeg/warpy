import {StoreSlice} from '../types';

export interface IFollowingDispatchers {
  dispatchFollowingAdd: (newFollowedUser: string) => Promise<void>;
  dispatchFollowingRemove: (unfollowedUser: string) => Promise<void>;
}

export const createFollowingDispatchers: StoreSlice<IFollowingDispatchers> = (
  set,
  get,
) => ({
  dispatchFollowingAdd: async newFollowedUser => {
    const {api} = get();
    await api.user.follow(newFollowedUser);

    set(state => ({
      following: [...state.following, newFollowedUser],
    }));
  },

  dispatchFollowingRemove: async unfollowedUser => {
    const {api} = get();
    await api.user.unfollow(unfollowedUser);

    set(state => ({
      following: state.following.filter(id => id !== unfollowedUser),
    }));
  },
});
