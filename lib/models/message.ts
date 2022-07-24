import { User } from "./user";

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: number;
  sender: User;
}
