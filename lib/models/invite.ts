import { IUser } from "./user";

export interface IInvite {
  id: string;
  stream: string;
  invitee: IUser;
  inviter: IUser;
}
