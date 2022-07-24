import { Invite } from "./invite";

export interface NotificationBase {
  id: string;
  user_id: string;
  invite_id?: string;
  hasBeenSeen: boolean;
  created_at: number;
}

export interface Notification extends NotificationBase {
  invite?: Invite;
}
