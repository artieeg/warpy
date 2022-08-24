import { Item } from "./entity";

export interface UserBase extends Item {
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;

  bio?: string;

  isAnon: boolean;

  online?: boolean;
}

export interface User extends UserBase {
  email: string | null;
  sub: string | null;
}
