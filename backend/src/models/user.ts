import mongoose, { Schema } from "mongoose";
import { IEntity } from "./entity";

export interface IBaseUser extends IEntity {
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;
}

export interface IUser extends IBaseUser {
  email: String;
  sub: String;
}

const UserSchema = new Schema<IUser>({
  username: String,
  last_name: String,
  first_name: String,
  email: String,
  sub: String,
  avatar: String,
});

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

UserSchema.set("toJSON", {
  virtuals: true,
});

export const UserModel = mongoose.model("User", UserSchema);

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
