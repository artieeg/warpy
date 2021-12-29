import { IFriendFeedResponse } from "@warpy/lib";
import { APIModule } from "./types";

export interface IFriendFeedAPI {
  get: () => Promise<IFriendFeedResponse>;
}

export const FriendFeedAPI: APIModule = (socket): IFriendFeedAPI => ({
  get: () => socket.request("friend-feed-get", {}),
});
