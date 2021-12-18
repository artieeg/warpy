import produce from "immer";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IFeedDispatchers {
  dispatchFeedFetchNext: () => Promise<void>;
  dispatchCategoryToggle: (id: string, isSelected: boolean) => Promise<void>;
}

export const createFeedDispatchers: StoreSlice<IFeedDispatchers> = (
  set,
  get
) => ({
  async dispatchFeedFetchNext() {
    set({ isFeedLoading: true });
    const { feed } = await get().api.feed.get(get().latestFeedPage);

    set((state) => ({
      feed: [...state.feed, ...feed],
    }));
  },

  async dispatchCategoryToggle(id, isSelected) {
    set(
      produce<IStore>((state) => {
        if (isSelected) {
          state.selectedCategoryIds = [...state.selectedCategoryIds, id];
        } else {
          state.selectedCategoryIds = state.selectedCategoryIds.filter(
            (id0) => id0 !== id
          );
        }
      })
    );
  },
});
