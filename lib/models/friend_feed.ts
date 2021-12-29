import { IStream } from "./candidate";
import { IBaseUser } from "./user";

export interface IFriendFeedItem {
  user: IBaseUser;
  stream?: IStream;
}
