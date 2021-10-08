import { IInvite } from "./invite";

export interface INotification {
  id: string;
  user_id: string;
  invite?: IInvite;
  hasBeenSeen: boolean;
  created_at: number;
}
