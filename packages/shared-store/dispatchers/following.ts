import { UserService } from "../app/user";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export interface IFollowingDispatchers {
  dispatchFollowingAdd: (newFollowedUser: string) => Promise<void>;
  dispatchFollowingRemove: (unfollowedUser: string) => Promise<void>;
}

export const createFollowingDispatchers: StoreSlice<IFollowingDispatchers> = (
  _set,
  get
) => ({
  dispatchFollowingAdd: async (newFollowedUser) => {
    await runner.mergeStateUpdate(
      new UserService(get()).follow(newFollowedUser)
    );
  },

  dispatchFollowingRemove: async (unfollowedUser) => {
    await runner.mergeStateUpdate(
      new UserService(get()).unfollow(unfollowedUser)
    );
  },
});
