import { Stream } from "./candidate";
import { UserBase } from "./user";

export interface FriendFeedItem {
  user: UserBase;
  stream?: Stream;
}
