import { StoreSlice } from "../types";

export interface IFriendFeedDispatchers {
  dispatchFetchFriendFeed: () => Promise<void>;
}

export const createFriendFeedDispatchers: StoreSlice<IFriendFeedDispatchers> = (
  set,
  get
) => ({
  async dispatchFetchFriendFeed() {
    const { feed: friendFeed } = await get().api.friend_feed.get();

    set({
      friendFeed,
    });
  },
});
