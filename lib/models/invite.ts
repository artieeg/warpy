import { IStream } from "./candidate";
import { IUser } from "./user";

export interface IInvite {
  id: string;
  stream: IStream | null;
  invitee: IUser;
  inviter: IUser;
}
