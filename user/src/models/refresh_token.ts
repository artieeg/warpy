import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  token: String,
});

export const RefreshToken = mongoose.model("Token", RefreshTokenSchema);
