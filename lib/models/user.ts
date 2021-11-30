import { IEntity } from "./entity";

export interface IBaseUser extends IEntity {
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;
  isAnon: boolean;
}

export interface IUser extends IBaseUser {
  email: string | null;
  sub: string | null;
}
