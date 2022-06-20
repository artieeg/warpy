import { IStreamCategory } from "@warpy/lib";
import { FeedService } from "../app/feed";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export interface IFeedDispatchers {
  dispatchFeedFetchNext: () => Promise<void>;
  dispatchFeedCategoryChange: (category: IStreamCategory) => Promise<void>;
}

export const createFeedDispatchers: StoreSlice<IFeedDispatchers> = (
  _set,
  get
) => ({
  async dispatchFeedCategoryChange(category) {
    await runner.mergeStateUpdate(
      new FeedService(get()).changeFeedCategory(category)
    );

    await runner.mergeStreamedUpdates(
      new FeedService(get()).fetchNextFeedPage()
    );
  },

  async dispatchFeedFetchNext() {
    await runner.mergeStreamedUpdates(
      new FeedService(get()).fetchNextFeedPage()
    );
  },
});
