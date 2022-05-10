import { IStream } from "./candidate";
import { IUser } from "./user";

type SentInviteState = "accepted" | "declined" | "unknown";

export interface IInviteBase {
  id: string;
  invitee_id: string;
  inviter_id: string;
  stream_id?: string;
}

export interface IInvite extends IInviteBase {
  invitee: IUser;
  inviter: IUser;
  stream?: IStream;
}

export interface IInviteNotification extends IInvite {
  notification: string;
}

export interface ISentInvite extends IInvite {
  state: SentInviteState;
}
