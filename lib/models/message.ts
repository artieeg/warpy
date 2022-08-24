import { UserBase } from "./user";

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: number;
  sender: UserBase;
}
