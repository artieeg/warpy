import { IFriendFeedItem } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IFriendFeedSlice {
  friendFeed: IFriendFeedItem[];
}

export const createFriendFeedSlice: StoreSlice<IFriendFeedSlice> = () => ({
  friendFeed: [],
});
