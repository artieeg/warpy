import { Roles } from "@app/types";
import mongoose from "mongoose";
import { IBaseUser } from "./user";
import { IEntity } from "./entity";

export interface IBaseParticipant extends IEntity {
  stream: string;
  role?: Roles;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

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
