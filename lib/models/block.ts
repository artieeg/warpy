import { IUser } from "./user";

export interface IUserBlock {
  id: string;
  blocked: IUser;
  blocker: string;
}
