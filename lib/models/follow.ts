import { User } from "./user";

export interface Follow {
  follower: User;
  followed: User;
}
