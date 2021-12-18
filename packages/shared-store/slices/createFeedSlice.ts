import { ICandidate } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IFeedSlice {
  selectedCategoryIds: string[];
  latestFeedPage: number;
  feed: ICandidate[];
  isFeedLoading: boolean;
}

export const createFeedSlice: StoreSlice<IFeedSlice> = () => ({
  latestFeedPage: 0,
  isFeedLoading: false,
  feed: [],
  selectedCategoryIds: [],
});
