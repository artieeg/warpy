import { IUser } from "./user";

export interface IAward {
  id: string;
  sender: IUser;
  recipent: IUser;
  visual: string;
  message: string;
  created_at: string;
}
