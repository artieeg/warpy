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

export const User = mongoose.model("User", UserSchema);
