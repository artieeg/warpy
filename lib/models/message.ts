import { IUser } from "./user";

export interface IChatMessage {
  id: string;
  message: string;
  timestamp: number;
  sender: IUser;
}
