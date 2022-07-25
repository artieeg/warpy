import { User } from "./user";

export interface Award {
  id: string;
  sender: User;
  recipent: User;
  visual: string;
  message: string;
  created_at: string;
}
