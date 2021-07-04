import mongoose from "mongoose";

export interface IUser {
  id: string;
  last_name: string;
  first_name: string;
  username: string;
  avatar: string;
}

export interface IParticipant extends IUser {
  role: "speaker" | "streamer" | "viewer";
  stream: mongoose.Types.ObjectId;
}

const ParticipantSchema = new mongoose.Schema<IParticipant>({
  last_name: String,
  first_name: String,
  username: String,
  avatar: String,
  role: String,
  stream: mongoose.Schema.Types.ObjectId,
});

ParticipantSchema.set("toJSON", {
  virtuals: true,
});

export const Participant = mongoose.model("Participant", ParticipantSchema);
