import { User } from "./user";

export interface UserBlock {
  id: string;
  blocked: User;
  blocker: string;
}
