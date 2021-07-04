import mongoose from "mongoose";
import { IParticipant } from "./participant";

export interface ICandidate {
  id: string;
  owner: string;
  title: string;
  hub: string;
}

export interface IStream extends ICandidate {
  participants: IParticipant[];
}

const CandidateSchema = new mongoose.Schema<ICandidate>({
  owner: mongoose.Schema.Types.ObjectId,
  hub: mongoose.Schema.Types.ObjectId,
  title: mongoose.Schema.Types.ObjectId,
});

CandidateSchema.set("toJSON", {
  virtuals: true,
});

export const Candidate = mongoose.model("Candidate", CandidateSchema);
