import mongoose from "mongoose";

const StreamSchema = new mongoose.Schema({
  title: String,
  owner: mongoose.Schema.Types.ObjectId,
  hub: mongoose.Schema.Types.ObjectId,
  live: Boolean,
});

StreamSchema.index({ owner: 1, live: true }, { unique: true });

StreamSchema.set("toJSON", {
  virtuals: true,
});

export const Stream = mongoose.model("Stream", StreamSchema);
