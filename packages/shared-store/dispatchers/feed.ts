import produce from "immer";
import { IStreamCategory } from "@warpy/lib";
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
  async dispatchFeedCategoryChange(category: IStreamCategory) {
    set({
      selectedFeedCategory: category,
      feed: [],
      latestFeedPage: 0,
    });

    get().dispatchFeedFetchNext();
  },

  async dispatchFeedFetchNext() {
    set({ isFeedLoading: true });

    const { feed } = await get().api.feed.get({
      page: get().latestFeedPage,
      category: get().selectedFeedCategory?.id,
    });

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
          if (state.selectedCategoryIds.length > 1) {
            state.selectedCategoryIds = state.selectedCategoryIds.filter(
              (id0) => id0 !== id
            );
          }
        }
      })
    );
  },
});
