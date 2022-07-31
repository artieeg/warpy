import {
  EventFriendFeedUserJoin,
  EventFriendFeedUserLeave,
  FriendFeedResponse,
} from "@warpy/lib";
import { APIModule, EventHandler } from "./types";

export interface IFriendFeedAPI {
  get: () => Promise<FriendFeedResponse>;
  onUserJoin: EventHandler<EventFriendFeedUserJoin>;
  onUserLeave: EventHandler<EventFriendFeedUserLeave>;
}

export const FriendFeedAPI: APIModule = (socket): IFriendFeedAPI => ({
  get: () => socket.request("friend-feed-get", {}),
  onUserJoin: (handler) => socket.on("@friend-feed/user-join", handler),
  onUserLeave: (handler) => socket.on("@friend-feed/user-leave", handler),
});
