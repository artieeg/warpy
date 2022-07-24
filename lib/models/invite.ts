import { Stream } from "./candidate";
import { User } from "./user";

type SentInviteState = "accepted" | "declined" | "unknown";

export interface InviteBase {
  id: string;
  invitee_id: string;
  inviter_id: string;
  stream_id?: string;

  received?: boolean;
}

export interface Invite extends InviteBase {
  invitee: User;
  inviter: User;
  stream?: Stream;
}

export interface InviteNotification extends Invite {
  notification: string;
}

export interface InviteSent extends Invite {
  state: SentInviteState;
}
