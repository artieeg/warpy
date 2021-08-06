import mongoose, { Schema } from "mongoose";
import { IBaseUser } from "@warpy/lib";

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
