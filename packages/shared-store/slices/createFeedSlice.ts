import { ICandidate } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IFeedSlice {
  selectedCategoryIds: string[];
  latestFeedPage: number;
  feed: ICandidate[];
  previousStreamId: string | null;
  isFeedLoading: boolean;
}

export const createFeedSlice: StoreSlice<IFeedSlice> = () => ({
  latestFeedPage: 0,
  isFeedLoading: false,
  previousStreamId: null,
  feed: [],
  selectedCategoryIds: [],
});
