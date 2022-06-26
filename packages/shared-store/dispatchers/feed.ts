import { IStreamCategory } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export interface IFeedDispatchers {
  dispatchFeedFetchNext: () => Promise<void>;
  dispatchFeedCategoryChange: (category: IStreamCategory) => Promise<void>;
}

export const createFeedDispatchers: StoreDispatcherSlice<IFeedDispatchers> = (
  runner,
  { feed }
) => ({
  async dispatchFeedCategoryChange(category) {
    await runner.mergeStateUpdate(feed.changeFeedCategory(category));
    await runner.mergeStreamedUpdates(feed.fetchNextFeedPage());
  },

  async dispatchFeedFetchNext() {
    await runner.mergeStreamedUpdates(feed.fetchNextFeedPage());
  },
});
