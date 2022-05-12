import { IInvite } from "./invite";

export interface INotificationBase {
  id: string;
  user_id: string;
  invite_id?: string;
  hasBeenSeen: boolean;
  created_at: number;
}

export interface INotification extends INotificationBase {
  invite?: IInvite;
}
