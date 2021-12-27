import { IParticipant } from "./participant";
import { IStream } from "./candidate";

export interface IFriendFeedItem {
  user: IParticipant;
  stream: IStream;
}
