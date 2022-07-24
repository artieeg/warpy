import { Item } from "./entity";

export interface UserBase extends Item {
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

export interface User extends UserBase {
  email: string | null;
  sub: string | null;
}
