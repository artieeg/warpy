import { IEntity } from "./entity";

export interface IBaseUser extends IEntity {
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;
  isAnon: boolean;

  /**
   * true = online
   * false = offline
   * undefined = should be omitted in UI :)
   * */
  online?: boolean;
}

export interface IUser extends IBaseUser {
  email: string | null;
  sub: string | null;
}
