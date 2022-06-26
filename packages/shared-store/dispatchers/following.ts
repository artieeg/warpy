import { StoreDispatcherSlice } from "../types";

export interface IFollowingDispatchers {
  dispatchFollowingAdd: (newFollowedUser: string) => Promise<void>;
  dispatchFollowingRemove: (unfollowedUser: string) => Promise<void>;
}

export const createFollowingDispatchers: StoreDispatcherSlice<IFollowingDispatchers> =
  (runner, { user }) => ({
    dispatchFollowingAdd: async (newFollowedUser) => {
      await runner.mergeStateUpdate(user.follow(newFollowedUser));
    },

    dispatchFollowingRemove: async (unfollowedUser) => {
      await runner.mergeStateUpdate(user.unfollow(unfollowedUser));
    },
  });
