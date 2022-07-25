import { UserBase } from "./user";

export interface AppInvite {
  id: string;
  user: UserBase;
  code: string;
}
