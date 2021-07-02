import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: String,
  last_name: String,
  first_name: String,
  email: String,
  sub: String,
  avatar: String,
});

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", UserSchema);
