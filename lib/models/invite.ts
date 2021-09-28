import { IStream } from "./candidate";
import { IUser } from "./user";

export interface IInvite {
  id: string;
  stream: IStream;
  invitee: IUser;
  inviter: IUser;
}
