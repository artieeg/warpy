import { IBaseUser } from "./user";

export interface IAppInvite {
  id: string;
  user: IBaseUser;
  code: string;
}
