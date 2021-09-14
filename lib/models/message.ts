import { IUser } from "./user";

export interface IChatMessage {
  message: string;
  timestamp: number;
  sender: IUser;
}
