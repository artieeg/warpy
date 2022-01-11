import produce from "immer";
import { IStreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IFeedDispatchers {
  dispatchFeedFetchNext: () => Promise<void>;
  dispatchCategoryToggle: (id: string, isSelected: boolean) => Promise<void>;
  dispatchFeedCategoryChange: (category: IStreamCategory) => Promise<void>;
}

export const createFeedDispatchers: StoreSlice<IFeedDispatchers> = (
  set,
  get
) => ({
  async dispatchFeedCategoryChange(category) {
    console.log("chaging category to", { category });

    set({
      selectedFeedCategory:
        get().selectedFeedCategory?.id === category.id ? null : category,
      feed: [],
      latestFeedPage: 0,
    });

    get().dispatchFeedFetchNext();
  },

  async dispatchFeedFetchNext() {
    set({ isFeedLoading: true });

    console.log({
      page: get().latestFeedPage,
      category: get().selectedFeedCategory?.id,
    });

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
