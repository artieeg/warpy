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

/*
export class BaseUser implements IBaseUser {
  id: string;
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;

  constructor(data: IBaseUser) {
    this.id = data.id;
    this.last_name = data.last_name;
    this.first_name = data.first_name;
    this.username = data.username;
    this.avatar = data.avatar;
  }

  static fromJSON(data: any) {
    return new BaseUser({
      id: data.id,
      last_name: data.last_name,
      first_name: data.first_name,
      username: data.username,
      avatar: data.avatar,
    });
  }
}
*/
