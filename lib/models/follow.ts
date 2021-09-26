import { IUser } from "./user";

export interface IFollow {
  follower: IUser;
  followed: IUser;
}
