import { IStream } from "./candidate";
import { IUser } from "./user";

type SentInviteState = "accepted" | "declined" | "unknown";

export interface IInvite {
  id: string;
  stream: IStream | null;
  invitee: IUser;
  inviter: IUser;
}

export interface IInviteNotification extends IInvite {
  notification: string;
}

export interface ISentInvite extends IInvite {
  state: SentInviteState;
}
