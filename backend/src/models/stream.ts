import mongoose from "mongoose";

export interface IStream {
  id: mongoose.Types.ObjectId;
  title: string;
  owner: mongoose.Types.ObjectId;
  hub: mongoose.Types.ObjectId;
  live: boolean;
}

const StreamSchema = new mongoose.Schema<IStream>({
  title: String,
  owner: mongoose.Schema.Types.ObjectId,
  hub: mongoose.Schema.Types.ObjectId,
  live: Boolean,
});

StreamSchema.index({ owner: 1, live: true }, { unique: true });

StreamSchema.set("toJSON", {
  virtuals: true,
});

export const Stream = mongoose.model<IStream>("Stream", StreamSchema);