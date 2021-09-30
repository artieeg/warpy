import { IInvite } from "./invite";

export interface INotification {
  id: string;
  invite?: IInvite;
  hasBeenSeen: boolean;
  created_at: number;
}
