import { IUser } from "./user";

export interface IInvite {
  stream: string;
  invitee: IUser;
  inviter: IUser;
}
